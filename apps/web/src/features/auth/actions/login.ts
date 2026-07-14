'use server';

import { apiEndpoints } from '@/lib/api/client';
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
    const response = await apiEndpoints.auth.login(credentials);
    
    storage.set(AUTH_CONFIG.TOKEN_KEY, response.accessToken);
    storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.refreshToken);
    
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    return { success: false, error: errorMessage };
  }
}
