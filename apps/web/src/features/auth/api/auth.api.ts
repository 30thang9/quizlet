/**
 * Auth API - Layer giao tiếp HTTP
 * Chỉ biết endpoint, không biết business logic
 * Types được định nghĩa trong ../types/
 */
import { api } from '@/shared/lib/api/client';
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  AuthTokens,
  User,
} from '../types';

export const authApi = {
  /**
   * POST /auth/login
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', data);
  },

  /**
   * POST /auth/register
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/register', data);
  },

  /**
   * POST /auth/forgot-password
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    return api.post<void>('/auth/forgot-password', data);
  },

  /**
   * POST /auth/reset-password
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return api.post<void>('/auth/reset-password', data);
  },

  /**
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    return api.post<void>('/auth/logout');
  },

  /**
   * POST /auth/refresh
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    return api.post<AuthTokens>('/auth/refresh', { refreshToken });
  },

  /**
   * GET /auth/me
   */
  me: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  /**
   * GET /auth/verify-email?token=xxx
   */
  verifyEmail: async (token: string): Promise<void> => {
    return api.get<void>(`/auth/verify-email?token=${token}`);
  },
};
