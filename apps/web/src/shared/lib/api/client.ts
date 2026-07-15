/**
 * API Client - Axios based HTTP client
 * Handles auth token, refresh, and error transformation
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from './api.types';
import { storage } from '@/shared/utils';
import { AUTH_CONFIG } from '@/shared/config';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';

// ============ Types ============

interface ExtendedRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  skipAuth?: boolean;
}

// ============ API Client Class ============

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (!(config as ExtendedRequestConfig).skipAuth) {
          const token = storage.get<string | null>(AUTH_CONFIG.TOKEN_KEY, null);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - Handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as ExtendedRequestConfig;

        // Handle 401 - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = storage.get<string | null>(AUTH_CONFIG.REFRESH_TOKEN_KEY, null);
            if (refreshToken) {
              const response = await axios.post<ApiResponse>(
                `${API_URL}/auth/refresh`,
                { refreshToken },
              );

              if (response.data.success && response.data.data) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data as Record<string, string>;
                storage.set(AUTH_CONFIG.TOKEN_KEY, accessToken);
                storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken);

                originalRequest.headers = {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${accessToken}`,
                };
                return this.client(originalRequest);
              }
            }
          } catch {
            storage.remove(AUTH_CONFIG.TOKEN_KEY);
            storage.remove(AUTH_CONFIG.REFRESH_TOKEN_KEY);
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        const apiError: ApiError = {
          code: this.getErrorCode(error.response?.status),
          message: this.getErrorMessage(error),
        };

        return Promise.reject(apiError);
      },
    );
  }

  private getErrorCode(status?: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_ERROR',
    };
    return codeMap[status || 0] || 'UNKNOWN_ERROR';
  }

  private getErrorMessage(error: AxiosError<ApiResponse>): string {
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    return error.message || 'An unexpected error occurred';
  }

  async get<T>(url: string, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    if (!response.data.success) {
      throw response.data.error;
    }
    return response.data.data as T;
  }

  async post<T>(url: string, data?: unknown, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    if (!response.data.success) {
      throw response.data.error;
    }
    return response.data.data as T;
  }

  async put<T>(url: string, data?: unknown, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    if (!response.data.success) {
      throw response.data.error;
    }
    return response.data.data as T;
  }

  async patch<T>(url: string, data?: unknown, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    if (!response.data.success) {
      throw response.data.error;
    }
    return response.data.data as T;
  }

  async delete<T>(url: string, config?: ExtendedRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    if (!response.data.success) {
      throw response.data.error;
    }
    return response.data.data as T;
  }
}

export const api = new ApiClient();
