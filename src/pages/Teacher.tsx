import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { TeacherClass } from '@/types';

export default function Teacher() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      checkTeacherAndLoad();
    }
  }, [authLoading, user]);

  async function checkTeacherAndLoad() {
    setLoadingClasses(true);
    const { data: teacher } = await supabase
      .from('teachers')
      .select('id')
      .eq('id', user!.id)
      .maybeSingle();

    if (!teacher) {
      setLoadingClasses(false);
      return;
    }

    setIsTeacher(true);
    const { data } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user!.id)
      .order('created_at');
    setClasses((data || []) as TeacherClass[]);
    setLoadingClasses(false);
  }

  async function sendMagicLink() {
    if (!email.trim()) return;
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/teacher` },
    });
    setSending(false);
    if (!error) setSent(true);
  }

  if (authLoading || loadingClasses) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Memuatkan...
      </div>
    );
  }

  // Not logged in — show magic link form
  if (!user || user.is_anonymous) {
    return (
      <div className="min-h-screen lg:grid lg:grid-cols-2">
        {/* Left: branded panel */}
        <div className="hidden lg:flex flex-col justify-center px-16 py-16 bg-[#546B41]">
          <div className="max-w-sm space-y-6">
            <span className="text-2xl font-bold text-white">tacly</span>
            <div>
              <h2 className="text-2xl font-semibold text-white leading-snug">Dashboard Cikgu</h2>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Pantau mastery setiap pelajar, cetak lembaran kerja, dan kesan siapa yang aktif minggu ini.
              </p>
            </div>
          </div>
        </div>
        {/* Right: form */}
        <div className="flex items-center justify-center px-6 py-16 bg-[#FFF8EC]">
          <div className="w-full max-w-sm space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Cikgu</h1>
              <p className="text-sm text-gray-500 mt-1">Masukkan emel untuk log masuk.</p>
            </div>

            {sent ? (
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-800">
                Link dihantar ke <strong>{email}</strong>. Semak inbox atau spam.
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMagicLink()}
                  placeholder="cikgu@email.com"
                  className="w-full border border-[#DCCCAC] rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 bg-white"
                />
                <button
                  onClick={sendMagicLink}
                  disabled={sending || !email.trim()}
                  className="w-full py-3 rounded-xl bg-[#546B41] text-white font-medium text-sm disabled:opacity-50"
                >
                  {sending ? 'Menghantar...' : 'Hantar link log masuk →'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not a teacher
  if (!isTeacher) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <p className="text-gray-700 font-medium">Akaun ini bukan akaun cikgu.</p>
          <p className="text-sm text-gray-500">Hubungi admin untuk mendaftarkan akaun cikgu.</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-gray-400 underline"
          >
            Log keluar
          </button>
        </div>
      </div>
    );
  }

  // Teacher dashboard — class list
  return (
    <div className="min-h-screen bg-[#FFF8EC]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Cikgu</h1>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-gray-400 hover:text-gray-600 underline mt-1"
          >
            Log keluar
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="text-center py-24 text-gray-400 text-sm">
            Tiada kelas lagi. Hubungi admin untuk menambah kelas.
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">Kelas anda</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => navigate(`/teacher/class/${cls.id}`)}
                  className="group flex flex-col items-start rounded-2xl bg-white border border-[#DCCCAC] px-6 py-5 text-left hover:border-gray-400 hover:shadow-sm transition-all"
                >
                  <div className="font-semibold text-gray-900 text-lg">{cls.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5 mb-6">{cls.school_code}</div>
                  <div className="text-gray-300 group-hover:text-gray-600 transition-colors text-sm">
                    Lihat kelas →
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
