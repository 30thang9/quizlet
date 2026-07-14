/**
 * Auth API functions
 * These are thin wrappers around the API client for auth operations
 */
import { api } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return api.post('/auth/login', data);
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    return api.post('/auth/register', data);
  },

  logout: async (): Promise<void> => {
    return api.post('/auth/logout', {});
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    return api.post('/auth/forgot-password', data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    return api.post('/auth/reset-password', data);
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    return api.post('/auth/refresh', { refreshToken });
  },
};
