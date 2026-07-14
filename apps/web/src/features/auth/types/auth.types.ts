// Auth types
import type { z } from 'zod';
import type { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema';

// Form data types (inferred from schemas)
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// API request/response types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

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

// Action result types
export interface AuthActionResult {
  success: boolean;
  error?: string;
}

// Component props
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
