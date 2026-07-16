import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../features/auth/useAuth';
import { setToken } from '../lib/authToken';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      refresh();
    }
    navigate('/', { replace: true });
  }, [searchParams, navigate, refresh]);

  return (
    <section>
      <h1>Signing in…</h1>
    </section>
  );
}
