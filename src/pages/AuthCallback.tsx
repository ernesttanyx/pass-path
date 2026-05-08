import { useEffect } from 'react';

const HANDLES = [
  'HarimauBiru', 'MacanKencang', 'ElangTinggi', 'SingaBerani',
  'NagaApi', 'KancilPintar', 'BurungEmas', 'TigerMuda',
];
function randomHandle() {
  const base = HANDLES[Math.floor(Math.random() * HANDLES.length)];
  return `${base}${Math.floor(10 + Math.random() * 90)}`;
}
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const dotBg: React.CSSProperties = {
  backgroundColor: '#FEFDF8',
  backgroundImage: 'radial-gradient(circle, #DDD5BE 1.2px, transparent 1.2px)',
  backgroundSize: '22px 22px',
};

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (user) {
        await supabase.from('users').upsert({
          id: user.id,
          anon_handle: randomHandle(),
          school_code: 'ANON',
          consent_status: 'pending',
          daily_token_usage: 0,
          last_token_reset: new Date().toISOString(),
        });
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={dotBg}>
      <p className="text-sm text-black/40">Mengesahkan akaun...</p>
    </div>
  );
}
