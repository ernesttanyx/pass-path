import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { KpStep, StepVariant, HintCache, CheckResult } from '@/types';
import TopicIntro from '@/components/practice/TopicIntro';
import AppNavbar from '@/components/layout/AppNavbar';

const StepCard = lazy(() => import('@/components/practice/StepCard'));

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'BM' | 'EN'>('BM');

  const [screen, setScreen] = useState<'topic-intro' | 'practice'>('topic-intro');
  const [step, setStep] = useState<KpStep | null>(null);
  const [variant, setVariant] = useState<StepVariant | null>(null);
  const [hints, setHints] = useState<HintCache[]>([]);
  const [wins, setWins] = useState(0);
  const [taskIdx, setTaskIdx] = useState(0);
  const [variants, setVariants] = useState<StepVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskStartTime] = useState(Date.now());

  useEffect(() => {
    loadFirstStep();
  }, []);

  async function loadFirstStep() {
    const { data: steps } = await supabase
      .from('kp_steps')
      .select('*')
      .eq('display_order', 1)
      .limit(1);

    if (!steps || steps.length === 0) { setLoading(false); return; }
    const s = steps[0] as KpStep;
    setStep(s);

    const { data: vars } = await supabase
      .from('step_variants')
      .select('*')
      .eq('kp_step_id', s.id)
      .order('display_order');

    const { data: hintRows } = await supabase
      .from('hint_cache')
      .select('*')
      .eq('kp_step_id', s.id);

    const varList = (vars || []) as StepVariant[];
    setVariants(varList);
    setVariant(varList[0] ?? null);
    setHints((hintRows || []) as HintCache[]);
    setLoading(false);
  }

  async function logAttempt(variantId: string, result: CheckResult, hintTierUsed: number) {
    if (!user) return;
    await supabase.from('attempts').insert({
      user_id: user.id,
      step_variant_id: variantId,
      student_input: String(result.numericValue ?? ''),
      is_correct: result.isCorrect,
      marks_awarded: result.marksAwarded,
      hint_tier_used: hintTierUsed || null,
      time_taken_ms: Date.now() - taskStartTime,
    });
  }

  const pendingAuth = useRef(false);

  function handleResult(result: CheckResult, hintTierUsed: number) {
    if (!variant) return;
    logAttempt(variant.id, result, hintTierUsed);
    if (result.isCorrect) {
      const newWins = wins + 1;
      setWins(newWins);
      if (newWins >= 3) pendingAuth.current = true;
    }
  }

  function handleProceed() {
    if (pendingAuth.current) {
      pendingAuth.current = false;
      navigate(user ? '/practice' : '/auth');
      return;
    }
    const next = taskIdx + 1;
    if (next < variants.length) {
      setTaskIdx(next);
      setVariant(variants[next]);
    }
  }

  // ── Shared wins badge ──────────────────────────────────────────────────────
  const winsBadge = wins > 0 && (
    <span className="flex items-center gap-1 text-sm font-medium text-black bg-green-50 rounded-full px-3 py-1">
      {wins} betul <Check size={13} />
    </span>
  );

  // ── Topic intro screen ─────────────────────────────────────────────────────
  if (screen === 'topic-intro') {
    return (
      <div className="min-h-screen dot-bg flex flex-col">
        <AppNavbar lang={lang} onLangToggle={() => setLang(l => l === 'BM' ? 'EN' : 'BM')} />
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-lg px-4 py-8 lg:py-14 space-y-6">
            <TopicIntro lang={lang} onDone={() => setScreen('practice')} />
            <div className="text-center pb-4">
              <button
                onClick={() => navigate('/practice')}
                className="text-xs text-gray-400 underline"
              >
                {lang === 'BM' ? 'Skip — terus ke latihan' : 'Skip — go to practice'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading / empty states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        {lang === 'BM' ? 'Memuatkan soalan pertama...' : 'Loading first question...'}
      </div>
    );
  }

  if (!step || !variant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500">Tiada soalan tersedia.</p>
          <button onClick={() => navigate('/practice')} className="underline text-blue-500">
            Ke latihan
          </button>
        </div>
      </div>
    );
  }

  // ── Practice screen ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen dot-bg flex flex-col lg:h-screen lg:overflow-hidden">
      <AppNavbar lang={lang} onLangToggle={() => setLang(l => l === 'BM' ? 'EN' : 'BM')} />
      <div className="flex-1 min-h-0 lg:grid lg:grid-cols-[320px_1fr] lg:overflow-hidden">

      {/* Left: context panel */}
      <aside className="bg-white border-b border-[#DCCCAC]/50 lg:border-b-0 lg:border-r lg:h-full lg:overflow-y-auto px-4 py-6 lg:px-8 lg:py-12 space-y-6">
        {/* wins badge on mobile */}
        <div className="flex items-center justify-between lg:hidden">
          {winsBadge}
        </div>

        {/* Desktop: topic context */}
        <div className="hidden lg:block space-y-4 pt-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Topik</p>
            <p className="font-semibold text-gray-900">Index Numbers</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Langkah</p>
            <p className="text-sm text-gray-700">{step.step_description_bm}</p>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Percubaan</p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i < wins ? 'bg-[#546B41]' : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Skip link */}
        <div className="hidden lg:block pt-4">
          <button
            onClick={() => navigate('/practice')}
            className="text-xs text-gray-400 underline"
          >
            {lang === 'BM' ? 'Terus ke semua topik →' : 'Go to full practice →'}
          </button>
        </div>
      </aside>

      {/* Right: practice card */}
      <main className="flex-1 min-h-0 overflow-hidden px-4 py-6 lg:px-10 lg:py-8 flex flex-col gap-4">
        {/* Wins message + action buttons */}
        {wins >= 3 && (
          <div className="rounded-xl bg-black/5 border border-black/10 p-6 text-center space-y-4">
            <p className="font-semibold text-black text-lg">
              {lang === 'BM' ? 'Gila bagus — 3 betul!' : 'Nice — 3 correct!'}
            </p>
            <p className="text-sm text-black/60">
              {user
                ? (lang === 'BM' ? 'Progress disimpan. Teruskan latihan sebenar.' : 'Progress saved. Continue to real practice.')
                : (lang === 'BM' ? 'Simpan progress kau supaya Cikgu Picks ingat mana kau dah buat.' : 'Save your progress so Cikgu Picks remembers where you left off.')}
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button
                onClick={() => navigate(user ? '/practice' : '/auth')}
                className="w-full py-3 rounded-xl bg-black text-white font-medium text-sm transition-colors"
              >
                {user
                  ? (lang === 'BM' ? 'Teruskan ke soalan SPM →' : 'Continue to SPM questions →')
                  : (lang === 'BM' ? 'Simpan progress →' : 'Save progress →')}
              </button>
              {!user && (
                <button
                  onClick={() => navigate('/practice')}
                  className="w-full py-3 rounded-xl border border-gray-200 text-black text-sm transition-colors"
                >
                  {lang === 'BM' ? 'Teruskan tanpa simpan →' : 'Continue without saving →'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* The task */}
        {wins < 3 && (
          <div className="flex-1 min-h-0">
            <Suspense fallback={<div className="h-48 flex items-center justify-center text-gray-400 text-sm">Memuatkan...</div>}>
              <StepCard
                key={`${variant.id}-${taskIdx}`}
                step={step}
                variant={variant}
                hints={hints}
                lang={lang}
                correctCount={wins}
                stepMasteryScore={0}
                onResult={handleResult}
                onProceed={handleProceed}
              />
            </Suspense>
          </div>
        )}

        {/* Skip to practice — mobile only */}
        {wins < 3 && (
          <div className="text-center lg:hidden">
            <button
              onClick={() => navigate('/practice')}
              className="text-xs text-gray-400 underline"
            >
              {lang === 'BM' ? 'Terus ke semua topik →' : 'Go to full practice →'}
            </button>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
