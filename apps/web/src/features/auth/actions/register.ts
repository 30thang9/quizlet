'use server';

import { authApi } from '@/features/auth/api';
import { storage, AUTH_CONFIG } from '@/shared/config';

interface RegisterResult {
  success: boolean;
  error?: string;
}

export async function registerAction(data: {
  email: string;
  password: string;
  name: string;
}): Promise<RegisterResult> {
  try {
    const response = await authApi.register(data);
    
    storage.set(AUTH_CONFIG.TOKEN_KEY, response.tokens.accessToken);
    storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.tokens.refreshToken);
    
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    return { success: false, error: errorMessage };
  }
}
