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
    forgotPassword: (body: { email: string }) => api.post('/auth/forgot-password', body),
    resetPassword: (body: { token: string; newPassword: string }) => api.post('/auth/reset-password', body),
  },

  users: {
    me: () => api.get('/users/me'),
    update: (data: { name?: string; avatarUrl?: string }) => api.patch('/users/me', data),
  },

  studySets: {
    list: (params?: { page?: number; limit?: number }) =>
      api.get('/study-sets', { params }),
    get: (id: string) => api.get(`/study-sets/${id}`),
    create: (data: { title: string; description?: string; visibility?: string; folderId?: string }) =>
      api.post('/study-sets', data),
    update: (id: string, data: Partial<{ title: string; description: string; folderId?: string }>) =>
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

  folders: {
    list: () => api.get('/folders'),
    get: (id: string) => api.get(`/folders/${id}`),
    create: (data: { name: string; color?: string; parentId?: string }) =>
      api.post('/folders', data),
    update: (id: string, data: Partial<{ name: string; color?: string; parentId?: string }>) =>
      api.patch(`/folders/${id}`, data),
    delete: (id: string) => api.delete(`/folders/${id}`),
    getStudySets: (id: string, params?: { page?: number; limit?: number }) =>
      api.get(`/folders/${id}/study-sets`, { params }),
    addStudySet: (id: string, data: { studySetId: string }) =>
      api.post(`/folders/${id}/study-sets`, data),
    removeStudySet: (id: string, studySetId: string) =>
      api.delete(`/folders/${id}/study-sets/${studySetId}`),
  },

  progress: {
    createSession: (data: { studySetId?: string; mode?: string }) =>
      api.post('/progress/sessions', data),
    endSession: (sessionId: string, data: {
      cardsStudied: number;
      correctCount: number;
      timeSpentSeconds: number;
      mistakes: number;
      score?: number;
    }) => api.patch(`/progress/sessions/${sessionId}`, data),
    reviewCard: (data: { cardId: string; studySessionId?: string; quality: number }) =>
      api.post('/progress/review', data),
    getCardProgress: (cardId: string) => api.get(`/progress/cards/${cardId}`),
    getDueCards: (params?: { studySetId?: string; limit?: number }) =>
      api.get('/progress/due', { params }),
    getStudySetProgress: (studySetId: string) =>
      api.get(`/progress/study-sets/${studySetId}`),
    getSessionHistory: (params?: { studySetId?: string; page?: number; limit?: number }) =>
      api.get('/progress/sessions', { params }),
    getStats: () => api.get('/progress/stats'),
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

  // Diagrams
  diagrams: {
    list: (params?: { page?: number; limit?: number }) =>
      api.get('/diagrams', { params }),
    get: (id: string) => api.get(`/diagrams/${id}`),
    create: (data: { title: string; description?: string; imageUrl: string; studySetId?: string }) =>
      api.post('/diagrams', data),
    update: (id: string, data: Partial<{ title: string; description: string; imageUrl: string }>) =>
      api.put(`/diagrams/${id}`, data),
    delete: (id: string) => api.delete(`/diagrams/${id}`),
    copy: (id: string) => api.post(`/diagrams/${id}/copy`),
    addLabel: (diagramId: string, data: { xPosition: number; yPosition: number; term: string; definition: string; hint?: string }) =>
      api.post(`/diagrams/${diagramId}/labels`, data),
    updateLabel: (labelId: string, data: Partial<{ term: string; definition: string; hint: string }>) =>
      api.patch(`/diagrams/labels/${labelId}`, data),
    deleteLabel: (labelId: string) => api.delete(`/diagrams/labels/${labelId}`),
    bulkAddLabels: (diagramId: string, data: { labels: Array<{ xPosition: number; yPosition: number; term: string; definition: string; hint?: string }> }) =>
      api.post(`/diagrams/${diagramId}/labels/bulk`, data),
    reorderLabels: (diagramId: string, data: { labelIds: string[] }) =>
      api.put(`/diagrams/${diagramId}/labels/reorder`, data),
  },

  // AI
  ai: {
    generateFlashcards: (data: {
      content: string;
      cardCount?: number;
      difficulty?: 'basic' | 'intermediate' | 'advanced';
      includeHints?: boolean;
      provider?: 'openai' | 'gemini' | 'claude';
    }) => api.post('/ai/generate-flashcards', data),
    generateSummary: (data: { content: string; maxLength?: number; provider?: string }) =>
      api.post<{ summary: string }>('/ai/generate-summary', data),
    generateQuiz: (data: {
      content: string;
      questionCount?: number;
      type?: 'multiple_choice' | 'true_false';
      provider?: string;
    }) => api.post<{ questions: any[] }>('/ai/generate-quiz', data),
    enhanceFlashcards: (data: {
      cards: { term: string; definition: string }[];
      provider?: string;
    }) => api.post('/ai/enhance-flashcards', data),
    answer: (data: { question: string; context: string; provider?: string }) =>
      api.post<{ answer: string }>('/ai/answer', data),
    magicNotes: (data: { content: string; cardCount?: number; provider?: string }) =>
      api.post<{ summary: string; flashcards: any[] }>('/ai/magic-notes', data),
  },
} as const;

export type ApiEndpoints = typeof apiEndpoints;
