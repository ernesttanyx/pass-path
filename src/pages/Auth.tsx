import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2 } from 'lucide-react';

const HANDLES = [
  'HarimauBiru', 'MacanKencang', 'ElangTinggi', 'SingaBerani',
  'NagaApi', 'KancilPintar', 'BurungEmas', 'TigerMuda',
];

function randomHandle() {
  const base = HANDLES[Math.floor(Math.random() * HANDLES.length)];
  return `${base}${Math.floor(10 + Math.random() * 90)}`;
}

const dotBg: React.CSSProperties = {
  backgroundColor: '#FFF8EC',
  backgroundImage: 'radial-gradient(circle, #DCCCAC 1.2px, transparent 1.2px)',
  backgroundSize: '22px 22px',
};

export default function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'choose' | 'handle'>('choose');

  // Already signed in with a real account → skip this page
  useEffect(() => {
    if (user?.email) navigate('/dashboard', { replace: true });
  }, [user, navigate]);
  const [handle] = useState(randomHandle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signInWithGoogle() {
    setLoading(true);
    setError('');
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function saveHandle() {
    if (!user) { navigate('/practice'); return; }
    setLoading(true);
    await supabase.from('users').upsert({
      id: user.id,
      anon_handle: handle,
      school_code: 'ANON',
      consent_status: 'pending',
      daily_token_usage: 0,
      last_token_reset: new Date().toISOString(),
    });
    navigate('/dashboard');
    setLoading(false);
  }

  if (mode === 'handle') {
    return (
      <div className="min-h-screen lg:grid lg:grid-cols-2">
        {/* Left: branded panel */}
        <BrandPanel />
        {/* Right: handle form */}
        <div className="flex items-center justify-center px-6 py-16" style={dotBg}>
          <div className="w-full max-w-sm space-y-8">
            <button
              onClick={() => setMode('choose')}
              className="text-sm text-black/40 hover:text-black/60 transition-colors"
            >
              ← balik
            </button>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-black tracking-tight">Nama kau</h2>
              <p className="text-sm text-black/40">Cikgu nampak ni, bukan nama sebenar.</p>
            </div>

            <div
              className="rounded-2xl px-6 py-8 text-center"
              style={{ backgroundColor: '#FFF8EC', border: '1px solid #E2D9C4' }}
            >
              <p className="text-3xl font-bold tracking-tight text-black">{handle}</p>
              <p className="text-xs text-black/40 mt-2">dijana secara rawak</p>
            </div>

            <button
              onClick={saveHandle}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-medium text-sm text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#546B41' }}
            >
              {loading ? 'Menyimpan...' : `Guna "${handle}"`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left: branded panel */}
      <BrandPanel />

      {/* Right: auth form */}
      <div className="flex items-center justify-center px-6 py-16" style={dotBg}>
        <div className="w-full max-w-sm space-y-10">

          {/* wordmark — mobile only (desktop shows in brand panel) */}
          <div className="text-center lg:hidden">
            <span className="text-2xl font-bold tracking-tight" style={{ color: '#546B41' }}>tacly</span>
          </div>

          {/* heading */}
          <div className="space-y-1.5 text-center lg:text-left">
            <h1 className="text-2xl font-semibold text-black tracking-tight">
              Simpan progress kau
            </h1>
            <p className="text-sm text-black/40 leading-relaxed">
              Supaya Cikgu Picks ingat mana kau dah buat.
            </p>
          </div>

          {/* actions */}
          <div className="space-y-3">
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-medium text-black/80 transition-all hover:shadow-sm disabled:opacity-60"
              style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #DDD5BE' }}
            >
              <GoogleIcon />
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ backgroundColor: '#DCCCAC' }} />
              <span className="text-xs text-black/40">atau</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#DCCCAC' }} />
            </div>

            <button
              onClick={() => setMode('handle')}
              className="w-full py-3.5 rounded-xl text-sm font-medium text-black/60 transition-all hover:shadow-sm"
              style={{ backgroundColor: '#FFF8EC', border: '1.5px solid #E2D9C4' }}
            >
              Guna nama anonymus je
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          {/* skip */}
          <div className="text-center">
            <button
              onClick={() => navigate('/practice')}
              className="text-xs text-black/40 hover:text-black/60 underline underline-offset-2 transition-colors"
            >
              Skip, sambung tanpa save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-center px-16 py-16" style={{ backgroundColor: '#546B41' }}>
      <div className="max-w-sm space-y-8">
        <div>
          <span className="text-3xl font-bold tracking-tight text-white">tacly</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white leading-snug">
            Latih diri, tengok markah naik.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Setiap soalan yang kau betulkan menaikkan skor ramalan SPM kau. Cikgu nampak progress kau secara real-time.
          </p>
        </div>
        <div className="space-y-4">
          {[
            'Latihan spaced-repetition ikut skema pemarkahan SPM sebenar',
            'Skor ramalan dikemas kini selepas setiap jawapan betul',
            'Nama anonymous — Cikgu track progress, bukan identiti',
          ].map((text) => (
            <div key={text} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-white/80 shrink-0 mt-0.5" />
              <span className="text-white/90 text-sm leading-relaxed">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
      <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
      <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
      <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
    </svg>
  );
}
