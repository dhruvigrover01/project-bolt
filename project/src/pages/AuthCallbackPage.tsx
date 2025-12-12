import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * OAuth Callback Handler
 * This page handles the redirect from OAuth providers (Google, etc.)
 * and completes the authentication flow.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed');
          return;
        }

        if (data.session) {
          // Check if we need to create a profile for new users
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.session.user.id)
            .single();

          if (!profile) {
            // Create profile for new OAuth users
            await supabase.from('profiles').insert({
              id: data.session.user.id,
              email: data.session.user.email,
              name: data.session.user.user_metadata?.full_name || 
                    data.session.user.user_metadata?.name || 
                    data.session.user.email?.split('@')[0],
              avatar_url: data.session.user.user_metadata?.avatar_url || 
                         data.session.user.user_metadata?.picture ||
                         `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.session.user.email}`,
              subscription_tier: 'free',
            });
          }

          // Redirect to the home page or saved redirect
          const redirectTo = localStorage.getItem('auth_redirect') || '/';
          localStorage.removeItem('auth_redirect');
          navigate(redirectTo, { replace: true });
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        navigate('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Completing sign in...</h2>
        <p className="text-slate-400">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}
