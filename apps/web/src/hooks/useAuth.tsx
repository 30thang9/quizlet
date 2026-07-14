'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiEndpoints } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'quizlet_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const user = await apiEndpoints.users.me();
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiEndpoints.auth.login({ email, password });
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiEndpoints.auth.register({ email, password, name });
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });
      return true;
    } catch (error) {
      console.error('Register error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshUser = async () => {
    try {
      const user = await apiEndpoints.users.me();
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
