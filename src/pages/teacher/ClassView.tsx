import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { generateWorksheetPdf } from '@/lib/pdf';
import { Printer } from 'lucide-react';
import type { KpStep, Mastery, TeacherClass } from '@/types';

interface StudentRow {
  user_id: string;
  anon_handle: string;
  predicted_score: number;
  mastery_by_step: Record<string, number>;
  days_active_this_week: number;
}

function heatColor(score: number): string {
  if (score >= 0.8) return 'bg-green-500';
  if (score >= 0.6) return 'bg-green-300';
  if (score >= 0.3) return 'bg-yellow-300';
  if (score > 0)   return 'bg-red-200';
  return 'bg-gray-100';
}

export default function ClassView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cls, setCls] = useState<TeacherClass | null>(null);
  const [steps, setSteps] = useState<KpStep[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (user && id) load();
  }, [user, id]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Class info
      const { data: clsData, error: clsErr } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id!)
        .eq('teacher_id', user!.id)
        .maybeSingle();
      if (clsErr || !clsData) throw new Error('Kelas tidak dijumpai.');
      setCls(clsData as TeacherClass);

      // All kp_steps for heatmap
      const { data: stepsData } = await supabase
        .from('kp_steps')
        .select('*')
        .order('topic')
        .order('display_order');
      const allSteps = (stepsData || []) as KpStep[];
      setSteps(allSteps);

      // Class members
      const { data: members } = await supabase
        .from('class_members')
        .select('user_id')
        .eq('class_id', id!);
      const userIds = (members || []).map((m: { user_id: string }) => m.user_id);

      if (userIds.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // Users
      const { data: usersData } = await supabase
        .from('users')
        .select('id, anon_handle, trial_exam_score')
        .in('id', userIds);

      // Mastery rows
      const { data: masteryData } = await supabase
        .from('mastery')
        .select('*')
        .in('user_id', userIds);
      const masteryRows = (masteryData || []) as Mastery[];

      // Predicted scores
      const { data: psData } = await supabase
        .from('predicted_score')
        .select('user_id, score')
        .in('user_id', userIds);

      // Days active this week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: attemptsData } = await supabase
        .from('attempts')
        .select('user_id, created_at')
        .in('user_id', userIds)
        .gte('created_at', weekAgo);

      const daysActiveMap: Record<string, Set<string>> = {};
      for (const a of attemptsData || []) {
        const day = a.created_at.slice(0, 10);
        if (!daysActiveMap[a.user_id]) daysActiveMap[a.user_id] = new Set();
        daysActiveMap[a.user_id].add(day);
      }

      const rows: StudentRow[] = userIds.map(uid => {
        const u = (usersData || []).find((x: { id: string }) => x.id === uid);
        const ps = (psData || []).find((x: { user_id: string }) => x.user_id === uid);
        const uMastery = masteryRows.filter(m => m.user_id === uid);
        const masteryByStep: Record<string, number> = {};
        for (const m of uMastery) {
          masteryByStep[m.kp_step_id] = Number(m.score_0_to_1);
        }
        return {
          user_id: uid,
          anon_handle: u?.anon_handle || uid.slice(0, 8),
          predicted_score: ps ? Math.round(Number(ps.score)) : (u?.trial_exam_score ?? 0),
          mastery_by_step: masteryByStep,
          days_active_this_week: daysActiveMap[uid]?.size ?? 0,
        };
      });

      rows.sort((a, b) => b.predicted_score - a.predicted_score);
      setStudents(rows);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ralat memuatkan kelas.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePrint() {
    if (!cls || steps.length === 0) return;
    setGeneratingPdf(true);

    // Weakest 3 steps by avg mastery across students
    const stepScores = steps.map(s => {
      const avg = students.length === 0 ? 0
        : students.reduce((sum, st) => sum + (st.mastery_by_step[s.id] ?? 0), 0) / students.length;
      return { step: s, avg };
    });
    stepScores.sort((a, b) => a.avg - b.avg);
    const weakest3 = stepScores.slice(0, 3).map(x => x.step);

    const { data: variantsData } = await supabase
      .from('step_variants')
      .select('*')
      .in('kp_step_id', weakest3.map(s => s.id))
      .order('display_order');

    await generateWorksheetPdf({
      className: cls.name,
      date: new Date().toLocaleDateString('ms-MY'),
      steps: weakest3,
      variants: variantsData || [],
    });
    setGeneratingPdf(false);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      Memuatkan...
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={() => navigate('/teacher')} className="text-sm underline text-blue-500">
          Kembali
        </button>
      </div>
    </div>
  );

  const passingCount = students.filter(s => s.predicted_score >= 40).length;
  const avgScore = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.predicted_score, 0) / students.length)
    : 0;
  const activeCount = students.filter(s => s.days_active_this_week > 0).length;

  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 md:mb-8 gap-4">
          <div>
            <button
              onClick={() => navigate('/teacher')}
              className="text-xs text-gray-400 hover:text-gray-600 mb-2 block"
            >
              ← Semua kelas
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{cls?.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{students.length} pelajar</p>
          </div>
          <button
            onClick={handlePrint}
            disabled={generatingPdf || students.length === 0}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#546B41] text-white text-sm font-medium disabled:opacity-50"
          >
            {generatingPdf ? 'Menjana...' : <span className="flex items-center gap-1.5"><Printer size={14} /> Cetak lembaran kerja</span>}
          </button>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-24 text-gray-400 text-sm">
            Tiada pelajar dalam kelas ini lagi.
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Jumlah pelajar', value: students.length, unit: '' },
                { label: 'Lulus (≥40)', value: passingCount, unit: `/ ${students.length}`, color: passingCount > 0 ? 'text-green-600' : 'text-red-500' },
                { label: 'Skor min', value: avgScore, unit: '/ 100' },
                { label: 'Aktif minggu ini', value: activeCount, unit: 'pelajar' },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="bg-white rounded-xl border border-[#DCCCAC] px-4 py-4 md:px-5 md:py-5">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                  <p className={`text-2xl md:text-3xl font-black ${color ?? 'text-gray-900'}`}>
                    {value}
                    {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop: side-by-side table + heatmap */}
            <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-6 space-y-6 lg:space-y-0">

              {/* Student table */}
              <div>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pelajar</h2>
                <div className="bg-white rounded-2xl border border-[#DCCCAC] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Pelajar</th>
                        <th className="text-center px-4 py-3 text-xs text-gray-400 font-medium">Skor ramalan</th>
                        <th className="text-center px-4 py-3 text-xs text-gray-400 font-medium">Aktif</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, i) => (
                        <tr key={s.user_id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FFF8EC]/50'}>
                          <td className="px-4 py-3 font-medium text-gray-800 text-sm">{s.anon_handle}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-bold text-base ${s.predicted_score >= 40 ? 'text-green-600' : 'text-red-500'}`}>
                              {s.predicted_score}
                            </span>
                            <span className="text-gray-300 text-xs">/100</span>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600 text-sm">
                            {s.days_active_this_week}d
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mastery heatmap */}
              <div>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Peta penguasaan</h2>
                <div className="bg-white rounded-2xl border border-[#DCCCAC] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="text-xs w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left px-3 py-2 text-gray-400 font-medium w-32 sticky left-0 bg-white z-10">
                            Pelajar
                          </th>
                          {steps.map(s => (
                            <th key={s.id} className="px-1 py-2 text-gray-400 font-normal min-w-[28px]" title={s.step_description_bm}>
                              <div className="text-center" style={{ writingMode: 'vertical-rl', maxHeight: 80 }}>
                                {s.display_order}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s, i) => (
                          <tr key={s.user_id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FFF8EC]/50'}>
                            <td className="px-3 py-1.5 font-medium text-gray-700 sticky left-0 bg-inherit z-10 whitespace-nowrap">
                              {s.anon_handle}
                            </td>
                            {steps.map(step => {
                              const score = s.mastery_by_step[step.id] ?? 0;
                              return (
                                <td key={step.id} className="px-1 py-1.5 text-center">
                                  <div
                                    className={`w-5 h-5 rounded-sm mx-auto ${heatColor(score)}`}
                                    title={`${step.step_description_bm}: ${Math.round(score * 100)}%`}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-3 px-3 py-2 border-t border-gray-100 text-xs text-gray-400">
                    <span>Legenda:</span>
                    {[
                      { label: 'Belum', color: 'bg-gray-100' },
                      { label: 'Lemah', color: 'bg-red-200' },
                      { label: 'Sedang', color: 'bg-yellow-300' },
                      { label: 'Baik', color: 'bg-green-300' },
                      { label: 'Kukuh', color: 'bg-green-500' },
                    ].map(({ label, color }) => (
                      <div key={label} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-sm ${color}`} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
