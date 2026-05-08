import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Flame, BookOpen, ArrowRight, LogOut, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { computePredictedScore } from '@/lib/mastery';
import type { KpStep, Mastery } from '@/types';

const DAYS_BM = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type DashData = {
  handle: string;
  predictedKMarks: number;
  streak: number;
  totalCorrect: number;
  weekActivity: boolean[];
  indexNumbers: { total: number; mastered: number; steps: boolean[] };
  linearProgramming: { total: number; mastered: number; steps: boolean[] };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const lang: 'BM' | 'EN' = 'BM';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashData>({
    handle: '',
    predictedKMarks: 0,
    streak: 0,
    totalCorrect: 0,
    weekActivity: Array(7).fill(false),
    indexNumbers: { total: 14, mastered: 0, steps: Array(14).fill(false) },
    linearProgramming: { total: 9, mastered: 0, steps: Array(9).fill(false) },
  });

  useEffect(() => {
    if (user) loadData();
    else setLoading(false);
  }, [user?.id]);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch in parallel
      const [profileRes, stepsRes, masteryRes, attemptsRes] = await Promise.all([
        supabase.from('users').select('anon_handle').eq('id', user.id).single(),
        supabase.from('kp_steps').select('id,topic,mark_value,display_order').order('display_order'),
        supabase.from('mastery').select('kp_step_id,score_0_to_1').eq('user_id', user.id),
        supabase.from('attempts').select('is_correct,created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      const handle = (profileRes.data?.anon_handle as string) || 'Anon';
      const allSteps = (stepsRes.data || []) as KpStep[];
      const mastery = (masteryRes.data || []) as Pick<Mastery, 'kp_step_id' | 'score_0_to_1'>[];
      const attempts = attemptsRes.data || [];

      const isMastered = (id: string) =>
        (mastery.find(m => m.kp_step_id === id)?.score_0_to_1 ?? 0) > 0.3;

      // Predicted K-marks (0–25 integer)
      const predictedKMarks = computePredictedScore(mastery, allSteps);

      // Total correct attempts
      const totalCorrect = attempts.filter(a => a.is_correct).length;

      // Weekly activity — which days this week (Sun–Sat) had at least one attempt
      const now = new Date();
      const todayIdx = now.getDay(); // 0=Sun…6=Sat
      const weekActivity = Array(7).fill(false);
      for (const a of attempts) {
        const d = new Date(a.created_at);
        const dayDiff = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
        if (dayDiff < 7) {
          const idx = ((todayIdx - dayDiff) + 7) % 7;
          weekActivity[idx] = true;
        }
      }

      // Streak — consecutive days with any attempt, ending today
      const dayKeys = new Set(attempts.map(a => {
        const d = new Date(a.created_at);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      }));
      let streak = 0;
      for (let i = 0; ; i++) {
        const d = new Date(now.getTime() - i * 86_400_000);
        if (dayKeys.has(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)) {
          streak++;
        } else {
          break;
        }
      }

      // Topic grouping — Index Numbers
      const indexSteps = allSteps.filter(s =>
        s.topic?.toLowerCase().includes('index') || s.topic?.toLowerCase().includes('indeks')
      );
      const lpSteps = allSteps.filter(s =>
        s.topic?.toLowerCase().includes('linear programming') ||
        s.topic?.toLowerCase().includes('pengaturcaraan')
      );

      setData({
        handle,
        predictedKMarks,
        streak,
        totalCorrect,
        weekActivity,
        indexNumbers: {
          total: indexSteps.length || 14,
          mastered: indexSteps.filter(s => isMastered(s.id)).length,
          steps: (indexSteps.length > 0 ? indexSteps : Array(14).fill({ id: '' })).map(s => isMastered(s.id)),
        },
        linearProgramming: {
          total: lpSteps.length || 9,
          mastered: lpSteps.filter(s => isMastered(s.id)).length,
          steps: (lpSteps.length > 0 ? lpSteps : Array(9).fill({ id: '' })).map(s => isMastered(s.id)),
        },
      });
    } catch {
      // silently show whatever partial data is available
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/');
  }

  const pct = (data.predictedKMarks / 25) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] dot-bg flex items-center justify-center text-black text-sm">
        {lang === 'BM' ? 'Memuatkan...' : 'Loading...'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EC] dot-bg">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-10 bg-[#FFF8EC]/90 backdrop-blur border-b border-[#DCCCAC]/60 px-4 h-12 flex items-center justify-between">
        <button
          onClick={() => navigate('/practice')}
          className="text-lg font-black tracking-tight text-black"
        >
          tacly
        </button>
        <div className="flex items-center gap-3">
          {data.handle && (
            <span className="text-sm font-medium text-black bg-black/8 px-3 py-1 rounded-full">
              {data.handle}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="p-2 rounded-full text-gray-400 hover:text-black hover:bg-black/5 transition-colors"
            title={lang === 'BM' ? 'Log keluar' : 'Sign out'}
          >
            <LogOut size={15} />
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-28">

        {/* ── Predicted score hero ────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#546B41] px-6 py-8 space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
            {lang === 'BM' ? 'Anggaran markah dari topik yang dah latih' : "Estimated marks from topics you've practised"}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-black text-white leading-none tabular-nums">
              {data.predictedKMarks}
            </span>
            <span className="text-2xl font-black text-white/60 mb-1 leading-none">/25</span>
          </div>
          <div className="w-full bg-[#3D5231] rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-[#99AD7A] rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>0</span>
            <span className="font-bold text-white/70">
              {lang === 'BM' ? 'Target lulus: 25' : 'Pass target: 25'}
            </span>
            <span>25</span>
          </div>
          {/* Stats row */}
          <div className="flex gap-4 pt-1">
            <div className="text-center">
              <p className="text-xl font-black text-white">{data.totalCorrect}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wide">
                {lang === 'BM' ? 'Betul' : 'Correct'}
              </p>
            </div>
            <div className="w-px bg-[#3D5231]" />
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <p className="text-xl font-black text-white">{data.streak}</p>
                <Flame size={16} className="text-orange-300" />
              </div>
              <p className="text-[10px] text-white/60 uppercase tracking-wide">
                {lang === 'BM' ? 'Hari berturut' : 'Day streak'}
              </p>
            </div>
            <div className="w-px bg-[#3D5231]" />
            <div className="text-center">
              <p className="text-xl font-black text-white">
                {data.indexNumbers.mastered + data.linearProgramming.mastered}
              </p>
              <p className="text-[10px] text-white/60 uppercase tracking-wide">
                {lang === 'BM' ? 'Steps faham' : 'Steps mastered'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Weekly activity ──────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-[#DCCCAC] px-5 py-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-black/40">
            {lang === 'BM' ? 'Minggu ini' : 'This week'}
          </p>
          <div className="flex gap-2">
            {data.weekActivity.map((active, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-full aspect-square rounded-lg transition-colors ${
                  active ? 'bg-[#546B41]' : 'bg-[#DCCCAC]/30'
                }`}>
                  {active && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-black/50 font-medium">
                  {(lang === 'BM' ? DAYS_BM : DAYS_EN)[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Topic mastery cards ──────────────────────────────────────────── */}
        <TopicCard
          lang={lang}
          title={lang === 'BM' ? 'Nombor Indeks' : 'Index Numbers'}
          mastered={data.indexNumbers.mastered}
          total={data.indexNumbers.total}
          steps={data.indexNumbers.steps}
          exam={lang === 'BM' ? 'P2 · Soalan 13–15 · ~10 markah' : 'P2 · Q13–15 · ~10 marks'}
        />
        <TopicCard
          lang={lang}
          title={lang === 'BM' ? 'Pengaturcaraan Linear' : 'Linear Programming'}
          mastered={data.linearProgramming.mastered}
          total={data.linearProgramming.total}
          steps={data.linearProgramming.steps}
          exam={lang === 'BM' ? 'P2 · Soalan 16 · ~10 markah' : 'P2 · Q16 · ~10 marks'}
        />

        {/* ── Tip card ────────────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white border border-[#DCCCAC] px-5 py-4 flex gap-3 items-start">
          <BookOpen size={16} className="text-white/70 shrink-0 mt-0.5" />
          <p className="text-sm text-black/50 leading-relaxed">
            {lang === 'BM'
              ? `Pelajar yang faham 8+ langkah Nombor Indeks boleh dapat 6–8 markah dalam peperiksaan. Kau dah faham ${data.indexNumbers.mastered}/${data.indexNumbers.total}.`
              : `Students who master 8+ Index Numbers steps typically score 6–8 marks in exams. You've mastered ${data.indexNumbers.mastered}/${data.indexNumbers.total}.`}
          </p>
        </div>

        {/* ── Progress insight ─────────────────────────────────────────────── */}
        {data.totalCorrect > 0 && (
          <div className="rounded-2xl bg-[#546B41]/8 border border-[#99AD7A]/30 px-5 py-4 flex gap-3 items-start">
            <TrendingUp size={16} className="text-black shrink-0 mt-0.5" />
            <p className="text-sm text-black leading-relaxed font-medium">
              {lang === 'BM'
                ? `${data.totalCorrect} jawapan betul setakat ni. Setiap betul = markah naik.`
                : `${data.totalCorrect} correct answers so far. Every correct = score up.`}
            </p>
          </div>
        )}

      </div>

      {/* ── Sticky CTA ──────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 px-4 pb-6 pt-3 bg-gradient-to-t from-[#FFF8EC] via-[#FFF8EC]/90 to-transparent">
        <button
          onClick={() => navigate('/practice')}
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 rounded-2xl bg-[#546B41] text-white font-black text-lg py-4 active:scale-[0.98] transition-transform hover:bg-[#3D5231] shadow-lg"
        >
          {lang === 'BM' ? 'Teruskan Latihan' : 'Continue Practice'}
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}

function TopicCard({
  lang, title, mastered, total, steps, exam,
}: {
  lang: 'BM' | 'EN';
  title: string;
  mastered: number;
  total: number;
  steps: boolean[];
  exam: string;
}) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
  return (
    <div className="rounded-2xl bg-white border border-[#DCCCAC] px-5 py-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-black text-base">{title}</p>
          <p className="text-xs text-black/50 mt-0.5">{exam}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-black">{mastered}</span>
          <span className="text-sm text-black/40">/{total}</span>
          <p className="text-[10px] text-black/50">
            {lang === 'BM' ? 'langkah faham' : 'steps mastered'}
          </p>
        </div>
      </div>

      <div className="h-2 bg-[#DCCCAC]/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#546B41] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {steps.map((done, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
              done ? 'bg-[#546B41]' : 'bg-[#DCCCAC]/30 border border-[#DCCCAC]'
            }`}
            title={`Step ${i + 1}`}
          >
            {done && <Check size={10} className="text-white" />}
          </div>
        ))}
      </div>
    </div>
  );
}
