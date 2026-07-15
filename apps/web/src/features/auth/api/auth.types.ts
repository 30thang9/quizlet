// Auth types
import type { z } from 'zod';
import type { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schema';

// ============ User & Tokens ============

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role: 'free' | 'plus' | 'admin';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ============ API Request/Response Types ============

export interface LoginRequest {
  email: string;
  password: string;
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
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ============ Form Data Types (inferred from schemas) ============

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ============ Action Result Types ============

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

// ============ Component Props Types ============

export interface LoginFormProps {
  redirectTo?: string;
}

export interface RegisterFormProps {
  redirectTo?: string;
}

export interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export interface ResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
}
