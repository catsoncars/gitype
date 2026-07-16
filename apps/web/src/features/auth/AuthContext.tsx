import { useCallback, useEffect, useState } from 'react';
import type { UserProfileDto } from '@gitype/shared';
import { fetchMe } from '../../lib/api';
import { clearToken, getToken } from '../../lib/authToken';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchMe()
      .then(setUser)
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, logout, refresh }}>{children}</AuthContext.Provider>;
}
