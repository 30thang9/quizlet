/**
 * Auth Service - Business Logic Layer
 * Xử lý data mapping, transform, error handling
 */
import { authApi, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../api/auth.api';
import { storage, AUTH_CONFIG } from '@/shared/config';
import type { AuthResponse, AuthActionResult, User } from '../types';

/**
 * Login service
 */
export async function loginService(credentials: LoginRequest): Promise<AuthActionResult> {
  try {
    const response = await authApi.login(credentials);
    
    // Store tokens
    storage.set(AUTH_CONFIG.TOKEN_KEY, response.tokens.accessToken);
    storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.tokens.refreshToken);
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

/**
 * Register service
 */
export async function registerService(data: RegisterRequest): Promise<AuthActionResult> {
  try {
    const response = await authApi.register(data);
    
    // Store tokens
    storage.set(AUTH_CONFIG.TOKEN_KEY, response.tokens.accessToken);
    storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.tokens.refreshToken);
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

/**
 * Forgot password service
 */
export async function forgotPasswordService(data: ForgotPasswordRequest): Promise<AuthActionResult> {
  try {
    await authApi.forgotPassword(data);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send reset email',
    };
  }
}

/**
 * Reset password service
 */
export async function resetPasswordService(data: ResetPasswordRequest): Promise<AuthActionResult> {
  try {
    await authApi.resetPassword(data);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reset password',
    };
  }
}

/**
 * Logout service
 */
export function logoutService(): void {
  storage.remove(AUTH_CONFIG.TOKEN_KEY);
  storage.remove(AUTH_CONFIG.REFRESH_TOKEN_KEY);
}

/**
 * Get current user service
 */
export async function getCurrentUserService(): Promise<User | null> {
  try {
    const user = await authApi.me();
    return user;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticatedService(): boolean {
  return storage.has(AUTH_CONFIG.TOKEN_KEY);
}
