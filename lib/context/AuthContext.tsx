'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  userData: { id: string; username: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{ id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On mount, derive auth state from persisted token and user info.
    // Guard localStorage access to avoid SSR/runtime failures.
    try {
      const token = authService.getToken();
      if (token && typeof window !== 'undefined') {
        const userId = localStorage?.getItem('user_id') || '';
        const username = localStorage?.getItem('username') || '';
        if (userId && username) {
          setIsAuthenticated(true);
          setUserData({ id: userId, username });
        }
      }
    } catch {
      // Ignore storage errors; show unauthenticated state
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      // On success, set in-memory auth state from API response
      setIsAuthenticated(true);
      setUserData({ id: response.user_id, username: response.username });
      router.push('/');
    } catch (error) {
      // Propagate for UI to display; avoid swallowing with a generic message
      throw error;
    }
  };

  const logout = () => {
    // Best-effort cleanup; never throw during logout flow
    try { authService.logout(); } catch {}
    setIsAuthenticated(false);
    setUserData(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}