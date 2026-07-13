/**
 * API Client - Axios based HTTP client với interceptors
 * Handles auth token, refresh, và error transformation
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@/types/api/response';
import { storage, AUTH_CONFIG } from '@/lib/utils';

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

    // Response interceptor - Handle errors & token refresh
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
                const { accessToken, refreshToken: newRefreshToken } = response.data.data as any;
                storage.set(AUTH_CONFIG.TOKEN_KEY, accessToken);
                storage.set(AUTH_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken);

                // Retry with new token
                originalRequest.headers = {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${accessToken}`,
                };
                return this.client(originalRequest);
              }
            }
          } catch {
            // Refresh failed - logout
            storage.remove(AUTH_CONFIG.TOKEN_KEY);
            storage.remove(AUTH_CONFIG.REFRESH_TOKEN_KEY);
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        // Transform error
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

  // ============ HTTP Methods ============

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

// ============ Export Singleton ============

export const api = new ApiClient();

// ============ Typed API Endpoints ============

export const apiEndpoints = {
  auth: {
    login: (body: { email: string; password: string }) => api.post('/auth/login', body),
    register: (body: { email: string; password: string; name: string }) =>
      api.post('/auth/register', body),
    refresh: (body: { refreshToken: string }) => api.post('/auth/refresh', body),
    logout: () => api.post('/auth/logout'),
  },

  users: {
    me: () => api.get('/users/me'),
    update: (data: { name?: string; avatarUrl?: string }) => api.patch('/users/me', data),
  },

  studySets: {
    list: (params?: { page?: number; limit?: number }) =>
      api.get('/study-sets', { params }),
    get: (id: string) => api.get(`/study-sets/${id}`),
    create: (data: { title: string; description?: string; visibility?: string }) =>
      api.post('/study-sets', data),
    update: (id: string, data: Partial<{ title: string; description: string }>) =>
      api.patch(`/study-sets/${id}`, data),
    delete: (id: string) => api.delete(`/study-sets/${id}`),
    like: (id: string) => api.post(`/study-sets/${id}/like`),
    unlike: (id: string) => api.delete(`/study-sets/${id}/like`),
  },

  cards: {
    list: (studySetId: string) => api.get(`/study-sets/${studySetId}/cards`),
    create: (studySetId: string, data: { term: string; definition: string }) =>
      api.post(`/study-sets/${studySetId}/cards`, data),
    update: (cardId: string, data: Partial<{ term: string; definition: string }>) =>
      api.patch(`/cards/${cardId}`, data),
    delete: (cardId: string) => api.delete(`/cards/${cardId}`),
  },

  search: {
    studySets: (params: { q?: string; sortBy?: string; page?: number; limit?: number }) =>
      api.get('/search/study-sets', { params }),
    users: (params: { q?: string }) => api.get('/search/users', { params }),
    tags: (params: { q?: string }) => api.get('/search/tags', { params }),
  },

  comments: {
    list: (studySetId: string, params?: { page?: number; limit?: number }) =>
      api.get(`/study-sets/${studySetId}/comments`, { params }),
    create: (studySetId: string, data: { content: string }) =>
      api.post(`/study-sets/${studySetId}/comments`, data),
    update: (commentId: string, data: { content: string }) =>
      api.patch(`/comments/${commentId}`, data),
    delete: (commentId: string) => api.delete(`/comments/${commentId}`),
    like: (commentId: string) => api.post(`/comments/${commentId}/like`),
  },

  classes: {
    list: (params?: { userId?: string }) => api.get('/classes', { params }),
    get: (id: string) => api.get(`/classes/${id}`),
    create: (data: { name: string; subject?: string; description?: string }) =>
      api.post('/classes', data),
    update: (id: string, data: Partial<{ name: string; description: string }>) =>
      api.patch(`/classes/${id}`, data),
    delete: (id: string) => api.delete(`/classes/${id}`),
    join: (code: string) => api.post('/classes/join', { enrollmentCode: code }),
    members: (classId: string) => api.get(`/classes/${classId}/members`),
  },

  tags: {
    list: (params?: { search?: string }) => api.get('/tags', { params }),
    findOrCreate: (data: { name: string; color?: string }) => api.post('/tags/find-or-create', data),
  },
} as const;

export type ApiEndpoints = typeof apiEndpoints;
