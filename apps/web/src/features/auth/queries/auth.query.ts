/**
 * Auth Queries - React Query Layer
 * Quản lý cache, loading, error, retry
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { logoutService } from '../services/auth.service';
import type { LoginRequest, RegisterRequest } from '../api/auth.api';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// ============ QUERIES ============

/**
 * Get current user query
 */
export function useMeQuery() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authApi.me(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============ MUTATIONS ============

/**
 * Login mutation
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
  });
}

/**
 * Register mutation
 */
export function useRegisterMutation() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

/**
 * Forgot password mutation
 */
export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
}

/**
 * Reset password mutation
 */
export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
}

/**
 * Logout mutation
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutService();
      queryClient.clear();
    },
  });
}
