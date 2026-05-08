import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface AppNavbarProps {
  lang?: 'BM' | 'EN';
  onLangToggle?: () => void;
  onLogoClick?: () => void;
}

export default function AppNavbar({ lang, onLangToggle, onLogoClick }: AppNavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-[#DCCCAC]/60 px-4 lg:px-8 h-12 flex items-center justify-between flex-shrink-0">
      <button
        onClick={() => onLogoClick ? onLogoClick() : navigate(user ? '/dashboard' : '/')}
        className="text-lg font-black tracking-tight text-black"
      >
        tacly
      </button>
      <div className="flex items-center gap-3">
        {onLangToggle && lang && (
          <button
            onClick={onLangToggle}
            className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
          >
            {lang}
          </button>
        )}
        {user ? (
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="text-xs bg-[#546B41] text-white rounded-full px-3 py-1.5 hover:bg-[#3D5231] transition-colors"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
