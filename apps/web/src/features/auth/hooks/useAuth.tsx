'use client';

import { createContext, useContext, useCallback, ReactNode, useEffect, useState } from 'react';
import { useMeQuery, useLoginMutation, useRegisterMutation, useLogoutMutation } from '../queries';
import { loginService, registerService, logoutService } from '../services/auth.service';
import { storage, AUTH_CONFIG } from '@/shared/config';
import type { User } from '../types';

// ============ Types ============

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============ Provider ============

export function AuthProvider({ children }: { children: ReactNode }) {
  // React Query hooks
  const { data: user, isLoading: isLoadingUser } = useMeQuery();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  // Local state for optimistic updates
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const token = storage.get(AUTH_CONFIG.TOKEN_KEY, null);
    setIsAuthenticated(!!token);
  }, []);

  // Update state when user data changes
  useEffect(() => {
    if (user) {
      setLocalUser(user);
      setIsAuthenticated(true);
    }
  }, [user]);

  // Login action
  const login = useCallback(async (email: string, password: string) => {
    const result = await loginService({ email, password });
    
    if (result.success) {
      setIsAuthenticated(true);
    }
    
    return result;
  }, []);

  // Register action
  const register = useCallback(async (email: string, password: string, name: string) => {
    const result = await registerService({ email, password, name });
    
    if (result.success) {
      setIsAuthenticated(true);
    }
    
    return result;
  }, []);

  // Logout action
  const logout = useCallback(() => {
    logoutService();
    logoutMutation.mutate();
    setLocalUser(null);
    setIsAuthenticated(false);
  }, [logoutMutation]);

  const value: AuthContextType = {
    user: localUser,
    isLoading: isLoadingUser || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============ Hook ============

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
