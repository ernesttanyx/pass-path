import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import QuestionGroupFlow from '@/components/practice/QuestionGroupFlow';
import { updateMastery, computePredictedScore } from '@/lib/mastery';
import AppNavbar from '@/components/layout/AppNavbar';
import { Target, Check, LayoutDashboard } from 'lucide-react';
import type { KpStep, StepVariant, HintCache, CheckResult, Mastery } from '@/types';

const SESSION_LIMIT = 5;

export default function Practice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'BM' | 'EN'>('BM');
  const [queue, setQueue] = useState<Array<{ step: KpStep; variant: StepVariant; hints: HintCache[] }>>([]);
  const [allSteps, setAllSteps] = useState<KpStep[]>([]);
  const [masteryRows, setMasteryRows] = useState<Mastery[]>([]);
  const [groupIdx, setGroupIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [predictedScore, setPredictedScore] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);
  const taskStartTime = useRef(Date.now());

  useEffect(() => { loadQueue(); }, [user?.id]);

  // Warn on browser back/close when mid-session
  useEffect(() => {
    if (!done && groupIdx > 0) {
      const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [done, groupIdx]);

  function handleLogoClick() {
    if (!done && groupIdx > 0) {
      setPendingNav('/dashboard');
      setShowLeaveWarning(true);
    } else {
      navigate('/dashboard');
    }
  }

  function confirmLeave() {
    setShowLeaveWarning(false);
    const dest = pendingNav;
    setPendingNav(null);
    if (dest) navigate(dest);
  }

  async function loadQueue() {
    setLoading(true);
    setError(null);
    try {
      // Fetch all steps across all topics
      const { data: steps, error: stepsErr } = await supabase
        .from('kp_steps')
        .select('*');
      if (stepsErr) throw stepsErr;
      if (!steps || steps.length === 0) throw new Error('No steps found');
      setAllSteps(steps as KpStep[]);

      // Fetch existing mastery rows for this user
      let mastery: Mastery[] = [];
      if (user) {
        const { data: mRows } = await supabase
          .from('mastery')
          .select('*')
          .eq('user_id', user.id);
        mastery = (mRows || []) as Mastery[];
        setMasteryRows(mastery);
        setPredictedScore(computePredictedScore(mastery, steps as KpStep[]));
      }

      // Build spaced-rep queue:
      // 1. Due steps (next_due_at <= now) ordered by soonest due
      // 2. New steps (no mastery row yet) ordered by frequency_score DESC
      const now = new Date().toISOString();
      const masteredIds = new Set(mastery.map(m => m.kp_step_id));

      const dueSteps = (steps as KpStep[])
        .filter(s => {
          const m = mastery.find(r => r.kp_step_id === s.id);
          return m && m.next_due_at <= now;
        })
        .sort((a, b) => {
          const ma = mastery.find(r => r.kp_step_id === a.id)!;
          const mb = mastery.find(r => r.kp_step_id === b.id)!;
          return ma.next_due_at.localeCompare(mb.next_due_at);
        });

      const newSteps = (steps as KpStep[])
        .filter(s => !masteredIds.has(s.id))
        .sort((a, b) => b.frequency_score - a.frequency_score);

      const selected = [...dueSteps, ...newSteps].slice(0, SESSION_LIMIT);
      const stepIds = selected.map(s => s.id);

      const { data: variants, error: varErr } = await supabase
        .from('step_variants')
        .select('*')
        .in('kp_step_id', stepIds);
      if (varErr) throw varErr;

      const { data: hints } = await supabase
        .from('hint_cache')
        .select('*')
        .in('kp_step_id', stepIds);

      const items = selected.map((step: KpStep) => {
        const stepVariants: StepVariant[] = (variants || []).filter(
          (v: StepVariant) => v.kp_step_id === step.id
        );
        // Prefer a variant not recently seen: pick randomly for now
        const variant = stepVariants[Math.floor(Math.random() * Math.max(stepVariants.length, 1))];
        const stepHints: HintCache[] = (hints || []).filter(
          (h: HintCache) => h.kp_step_id === step.id
        );
        return { step, variant, hints: stepHints };
      }).filter(item => item.variant);

      setQueue(items);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ralat memuatkan soalan.');
    } finally {
      setLoading(false);
    }
  }

  // Group queue items that share the same full question into one "question group".
  // Items without a full question are their own solo group.
  const groupedQueue = useMemo(() => {
    type QueueItem = { step: KpStep; variant: StepVariant; hints: HintCache[] };
    const groups: QueueItem[][] = [];
    const keyToIdx = new Map<string, number>();

    for (const item of queue) {
      const key = item.variant.full_question_bm?.trim() || `__solo__${item.variant.id}`;
      const existing = keyToIdx.get(key);
      if (existing !== undefined) {
        groups[existing].push(item);
      } else {
        keyToIdx.set(key, groups.length);
        groups.push([item]);
      }
    }

    // Sort parts within each group by part label (a < b < c)
    for (const group of groups) {
      group.sort((a, b) => {
        const pa = a.variant.part_guide_json?.find(g => g.action === 'do')?.part ?? 'z';
        const pb = b.variant.part_guide_json?.find(g => g.action === 'do')?.part ?? 'z';
        return pa.localeCompare(pb);
      });
    }

    return groups;
  }, [queue]);

  async function logAttempt(
    variantId: string,
    studentInput: string,
    result: CheckResult,
    hintTierUsed: number,
    timeTakenMs: number
  ) {
    if (!user) return;
    await supabase.from('attempts').insert({
      user_id: user.id,
      step_variant_id: variantId,
      student_input: studentInput,
      is_correct: result.isCorrect,
      marks_awarded: result.marksAwarded,
      hint_tier_used: hintTierUsed || null,
      time_taken_ms: timeTakenMs,
    });
  }

  function handlePartResult(result: CheckResult, hintTierUsed: number, step: KpStep, variant: StepVariant) {
    const timeTakenMs = Date.now() - taskStartTime.current;

    logAttempt(variant.id, String(result.numericValue ?? ''), result, hintTierUsed, timeTakenMs);

    // Correct → update mastery + score gauge
    if (result.isCorrect) {
      taskStartTime.current = Date.now();
      const existing = masteryRows.find(m => m.kp_step_id === step.id) ?? null;
      const updated = updateMastery(existing, step.id, user?.id ?? 'anon', true, timeTakenMs);
      const newRows = [...masteryRows.filter(m => m.kp_step_id !== step.id), updated as Mastery];
      setMasteryRows(newRows);
      setPredictedScore(computePredictedScore(newRows, allSteps));
      if (user) {
        supabase.from('mastery').upsert({ ...updated }, { onConflict: 'user_id,kp_step_id' }).catch(() => {});
      }
      setCorrectCount(c => c + 1);
    }

    // Tier 4 hint used on a wrong answer → force resurface tomorrow
    if (!result.isCorrect && hintTierUsed >= 4 && user) {
      const existing = masteryRows.find(m => m.kp_step_id === step.id) ?? null;
      const reset = updateMastery(existing, step.id, user.id, false, timeTakenMs);
      const newRows = [...masteryRows.filter(m => m.kp_step_id !== step.id), reset as Mastery];
      setMasteryRows(newRows);
      supabase.from('mastery').upsert({ ...reset }, { onConflict: 'user_id,kp_step_id' }).catch(() => {});
    }
  }

  function handleGroupDone() {
    if (groupIdx + 1 >= groupedQueue.length) {
      setDone(true);
    } else {
      setGroupIdx(i => i + 1);
      taskStartTime.current = Date.now();
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center text-black text-sm">
        {lang === 'BM' ? 'Memuatkan...' : 'Loading...'}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={loadQueue} className="underline text-black text-sm">Cuba lagi</button>
        </div>
      </div>
    );
  }

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 dot-bg">
        <div className="w-full max-w-sm lg:max-w-2xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">

            {/* Left: message + desktop buttons */}
            <div className="text-center lg:text-left space-y-4 mb-6 lg:mb-0">
              <div className="flex justify-center lg:justify-start">
                <Target size={40} className="text-black" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-black">
                {lang === 'BM' ? 'Jumpa esok lah.' : 'See you tomorrow.'}
              </h2>
              <p className="text-black/50 text-sm lg:text-base">
                {lang === 'BM'
                  ? `Dapat ${correctCount} betul hari ni. Dah cukup.`
                  : `${correctCount} correct today. That's enough.`}
              </p>
              <div className="hidden lg:flex flex-col gap-3 pt-2">
                {user?.email ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="py-3 rounded-xl bg-[#546B41] text-white font-medium text-sm hover:bg-[#3D5231] transition-colors"
                  >
                    {lang === 'BM' ? 'Ke Dashboard →' : 'Go to Dashboard →'}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/auth')}
                    className="py-3 rounded-xl bg-[#546B41] text-white font-medium text-sm hover:bg-[#3D5231] transition-colors"
                  >
                    {lang === 'BM' ? 'Simpan progress →' : 'Save progress →'}
                  </button>
                )}
                <button
                  onClick={() => { taskStartTime.current = Date.now(); setDone(false); setGroupIdx(0); setCorrectCount(0); loadQueue(); }}
                  className="py-3 rounded-xl border border-[#DCCCAC] text-black text-sm hover:bg-[#DCCCAC]/20 transition-colors"
                >
                  {lang === 'BM' ? 'Teruskan lagi' : 'Keep going'}
                </button>
              </div>
            </div>

            {/* Right: score gauge + mobile buttons */}
            <div className="space-y-4">
              {predictedScore !== null && (
                <div className="rounded-xl bg-white border border-[#DCCCAC] px-5 py-5 lg:py-8 shadow-sm">
                  <div className="text-xs text-white/70 mb-2 lg:mb-3 uppercase tracking-wider font-medium">
                    {lang === 'BM' ? 'Anggaran markah dari topik yang dah latih' : 'Estimated marks from topics you\'ve practised'}
                  </div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl lg:text-5xl font-black text-black">
                      {predictedScore}
                    </span>
                    <span className="text-white/60 text-sm mb-1">/ 25</span>
                  </div>
                  <div className="h-2.5 bg-[#DCCCAC]/40 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-[#546B41] rounded-full transition-all duration-700"
                      style={{ width: `${(predictedScore / 25) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-black/50 leading-relaxed">
                    {lang === 'BM'
                      ? 'Nak lulus Add Maths, 25 marks dah lebih dari cukup. Tacly akan ajar kau macam mana nak curi 25 marks tu — soalan yang sama je keluar tiap tahun.'
                      : 'To pass Add Maths, 25 marks is more than enough. Tacly will show you exactly how to find those 25 marks — the same questions repeat every year.'}
                  </p>
                </div>
              )}
              <div className="lg:hidden space-y-3">
                {user?.email ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="block w-full py-3 rounded-xl bg-[#546B41] text-white font-medium text-sm"
                  >
                    {lang === 'BM' ? 'Ke Dashboard →' : 'Go to Dashboard →'}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/auth')}
                    className="block w-full py-3 rounded-xl bg-[#546B41] text-white font-medium text-sm"
                  >
                    {lang === 'BM' ? 'Simpan progress →' : 'Save progress →'}
                  </button>
                )}
                <button
                  onClick={() => { taskStartTime.current = Date.now(); setDone(false); setGroupIdx(0); setCorrectCount(0); loadQueue(); }}
                  className="block w-full py-3 rounded-xl border border-[#DCCCAC] text-black text-sm"
                >
                  {lang === 'BM' ? 'Teruskan lagi' : 'Keep going'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  const currentGroup = groupedQueue[groupIdx];
  if (!currentGroup) return null;

  // ── Main practice screen ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFF8EC] flex flex-col lg:h-screen lg:overflow-hidden dot-bg">
      {/* Leave warning modal */}
      {showLeaveWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-black">Tinggalkan sesi?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Progress soalan yang belum selesai dalam sesi ini tidak akan disimpan.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={confirmLeave}
                className="w-full py-3 rounded-xl bg-black text-white font-semibold text-sm"
              >
                Ya, tinggalkan
              </button>
              <button
                onClick={() => setShowLeaveWarning(false)}
                className="w-full py-3 rounded-xl border border-gray-200 text-black text-sm"
              >
                Teruskan latihan
              </button>
            </div>
          </div>
        </div>
      )}
      <AppNavbar lang={lang} onLangToggle={() => setLang(l => l === 'BM' ? 'EN' : 'BM')} onLogoClick={handleLogoClick} />
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row lg:overflow-hidden">

      {/* ─── Sidebar: cream on mobile, forest green on desktop ──────────── */}
      <aside className="flex-shrink-0 bg-[#FFF8EC] border-b border-[#DCCCAC] lg:bg-[#546B41] lg:border-b-0 lg:w-72 lg:h-full lg:overflow-y-auto flex flex-col gap-3 px-4 py-3 lg:px-6 lg:py-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base lg:text-xl font-bold text-black lg:text-white">
              {lang === 'BM' ? 'Tacly' : 'Tacly'}
            </h1>
            <p className="text-xs text-black/50 lg:text-white/60">
              {groupIdx + 1} / {groupedQueue.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm font-medium text-black lg:text-white/70">
              <Check size={13} /> {correctCount}
            </span>
          </div>
        </div>

        {/* Session progress bar */}
        <div className="h-1 bg-[#DCCCAC]/50 lg:bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#546B41] lg:bg-[#99AD7A] transition-all duration-500 rounded-full"
            style={{ width: `${(groupIdx / groupedQueue.length) * 100}%` }}
          />
        </div>

        {/* Score gauge */}
        {predictedScore !== null && (
          <div className="rounded-xl bg-white border border-[#DCCCAC] lg:bg-white/10 lg:border-white/10 px-4 py-3 lg:py-5">
            <div className="text-xs text-black/50 lg:text-white/60 mb-1 lg:mb-3 lg:uppercase lg:tracking-wider lg:font-medium">
              {lang === 'BM' ? 'Anggaran markah dari topik yang dah latih' : 'Estimated marks from topics you\'ve practised'}
            </div>
            <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
              <div className="flex-1 lg:w-full h-1.5 bg-[#DCCCAC]/40 lg:bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#546B41] lg:bg-[#99AD7A] rounded-full transition-all duration-700"
                  style={{ width: `${(predictedScore / 25) * 100}%` }}
                />
              </div>
              <div className="text-sm font-bold text-black lg:text-white shrink-0 lg:text-3xl lg:font-black lg:mt-1">
                {predictedScore}<span className="text-xs font-normal text-black/50 lg:text-white/50">/25</span>
              </div>
            </div>
            <p className="text-[10px] text-black/50 lg:text-white/60/60 mt-1.5 leading-snug">
              {lang === 'BM' ? '25 marks = cukup untuk lulus' : '25 marks = enough to pass'}
            </p>
          </div>
        )}

        {/* Dashboard link */}
        {user && (
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden lg:flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
          >
            <LayoutDashboard size={13} />
            {lang === 'BM' ? 'Dashboard kau' : 'Your dashboard'}
          </button>
        )}

        {/* Step list — desktop only */}
        <div className="hidden lg:flex flex-col flex-1 min-h-0 mt-2">
          <p className="text-xs text-white/60 uppercase tracking-wider font-medium mb-2 flex-shrink-0">
            {lang === 'BM' ? 'Sesi ini' : 'This session'}
          </p>
          <div className="space-y-1 overflow-y-auto flex-1">
            {groupedQueue.map((group, idx) => {
              const firstItem = group[0];
              const partLabels = group.length > 1
                ? group.map((it, i) => {
                    const g = it.variant.part_guide_json?.find(pg => pg.action === 'do');
                    return g?.part || `(${String.fromCharCode(97 + i)})`;
                  }).join(' ')
                : null;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-colors ${
                    idx === groupIdx
                      ? 'bg-white/15 text-white'
                      : idx < groupIdx
                        ? 'text-white/70'
                        : 'text-white/40 hover:bg-white/5'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    idx === groupIdx ? 'bg-white/20 text-white'
                    : idx < groupIdx ? 'bg-[#99AD7A]/30 text-white/70'
                    : 'bg-white/10 text-white/60/50'
                  }`}>
                    {idx < groupIdx ? '✓' : idx + 1}
                  </span>
                  <div className="truncate flex-1 min-w-0">
                    <span className="truncate block">
                      {(lang === 'BM' ? firstItem.step.step_description_bm : firstItem.step.step_description_en)?.slice(0, 38)}
                    </span>
                    {partLabels && (
                      <span className="text-[10px] opacity-60">{partLabels}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ─── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto lg:overflow-hidden px-4 pb-6 pt-2 lg:px-10 lg:py-8">
        <QuestionGroupFlow
          key={groupIdx}
          group={currentGroup}
          lang={lang}
          correctCount={correctCount}
          masteryRows={masteryRows}
          userId={user?.id}
          onPartResult={handlePartResult}
          onGroupDone={handleGroupDone}
          onBack={groupIdx > 0 ? () => { setGroupIdx(i => i - 1); taskStartTime.current = Date.now(); } : undefined}
        />
      </main>
      </div>
    </div>
  );
}
