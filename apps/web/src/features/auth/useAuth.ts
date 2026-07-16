import { createContext, useContext } from 'react';
import type { UserProfileDto } from '@gitype/shared';

export interface AuthContextValue {
  user: UserProfileDto | null;
  loading: boolean;
  logout: () => void;
  refresh: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
