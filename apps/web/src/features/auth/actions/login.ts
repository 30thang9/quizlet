'use server';

import { authApi } from '@/features/auth/api';
import { storage, AUTH_CONFIG } from '@/shared/config';

interface LoginResult {
  success: boolean;
  error?: string;
}

export async function loginAction(credentials: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  try {
    const response = await authApi.login(credentials);
    
    storage.set(AUTH_CONFIG.TOKEN_KEY, response.tokens.accessToken);
    storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.tokens.refreshToken);
    
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    return { success: false, error: errorMessage };
  }
}
