'use client';

import { createContext, useContext, useCallback, ReactNode, useEffect, useState } from 'react';
import { authApi } from '../api';
import { storage, AUTH_CONFIG } from '@/shared/config';
import type { User } from '../api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    const token = storage.get(AUTH_CONFIG.TOKEN_KEY, null);
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.me();
      setUser(userData);
      setIsAuthenticated(true);
    } catch {
      storage.remove(AUTH_CONFIG.TOKEN_KEY);
      storage.remove(AUTH_CONFIG.REFRESH_TOKEN_KEY);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      storage.set(AUTH_CONFIG.TOKEN_KEY, response.tokens.accessToken);
      storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.tokens.refreshToken);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const response = await authApi.register({ email, password, name });
      storage.set(AUTH_CONFIG.TOKEN_KEY, response.tokens.accessToken);
      storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.tokens.refreshToken);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Registration failed' };
    }
  }, []);

  const logout = useCallback(() => {
    storage.remove(AUTH_CONFIG.TOKEN_KEY);
    storage.remove(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
    authApi.logout().catch(() => {});
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
