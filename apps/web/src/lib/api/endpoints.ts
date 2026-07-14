/**
 * API Endpoints - Wrapper for feature-specific API calls
 * This provides backward compatibility with the old apiEndpoints pattern
 */
import { api } from '@/shared/lib/api/client';

// Auth API
export const authApi = {
  login: (body: { email: string; password: string }) =>
    api.post<{ user: any; tokens: { accessToken: string; refreshToken: string } }>('/auth/login', body),
  register: (body: { email: string; password: string; name: string }) =>
    api.post<{ user: any; tokens: { accessToken: string; refreshToken: string } }>('/auth/register', body),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<any>('/auth/me'),
  refresh: (body: { refreshToken: string }) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', body),
  forgotPassword: (body: { email: string }) => api.post('/auth/forgot-password', body),
  resetPassword: (body: { token: string; newPassword: string }) => api.post('/auth/reset-password', body),
};

// Users API
export const usersApi = {
  me: () => api.get<any>('/users/me'),
  update: (data: { name?: string; avatarUrl?: string }) => api.patch('/users/me', data),
};

// Study Sets API
export const studySetsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<{ items: any[]; total: number }>('/study-sets', { params }),
  get: (id: string) => api.get<any>(`/study-sets/${id}`),
  create: (data: { title: string; description?: string; visibility?: string; folderId?: string }) =>
    api.post<any>('/study-sets', data),
  update: (id: string, data: { title?: string; description?: string; folderId?: string }) =>
    api.patch<any>(`/study-sets/${id}`, data),
  delete: (id: string) => api.delete(`/study-sets/${id}`),
};

// Classes API
export const classesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<{ items: any[]; total: number }>('/classes', { params }),
  get: (id: string) => api.get<any>(`/classes/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post<any>('/classes', data),
  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch<any>(`/classes/${id}`, data),
  delete: (id: string) => api.delete(`/classes/${id}`),
};

// Folders API
export const foldersApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<{ items: any[]; total: number }>('/folders', { params }),
  get: (id: string) => api.get<any>(`/folders/${id}`),
  create: (data: { name: string; parentId?: string }) =>
    api.post<any>('/folders', data),
  update: (id: string, data: { name?: string; parentId?: string }) =>
    api.patch<any>(`/folders/${id}`, data),
  delete: (id: string) => api.delete(`/folders/${id}`),
};

// Progress API
export const progressApi = {
  createSession: (data: { studySetId?: string; mode?: string }) =>
    api.post<any>('/progress/sessions', data),
  endSession: (sessionId: string, data: any) =>
    api.patch(`/progress/sessions/${sessionId}`, data),
  reviewCard: (data: { cardId: string; studySessionId?: string; quality: number }) =>
    api.post<any>('/progress/review', data),
  getCardProgress: (cardId: string) =>
    api.get<any>(`/progress/cards/${cardId}`),
  getDueCards: (params?: { studySetId?: string; limit?: number }) =>
    api.get<any[]>('/progress/due', { params }),
  getStudySetProgress: (studySetId: string) =>
    api.get<any>(`/progress/study-sets/${studySetId}`),
  getStats: () => api.get<any>('/progress/stats'),
};

// AI API
export const aiApi = {
  generateFlashcards: (data: {
    content: string;
    cardCount?: number;
    difficulty?: 'basic' | 'intermediate' | 'advanced';
    includeHints?: boolean;
    provider?: 'openai' | 'gemini' | 'claude';
  }) => api.post<{ cards: any[] }>('/ai/generate-flashcards', data),
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
  }) => api.post<{ cards: any[] }>('/ai/enhance-flashcards', data),
  answer: (data: { question: string; context: string; provider?: string }) =>
    api.post<{ answer: string }>('/ai/answer', data),
  magicNotes: (data: { content: string; cardCount?: number; provider?: string }) =>
    api.post<{ summary: string; flashcards: any[] }>('/ai/magic-notes', data),
};

// Combined apiEndpoints for backward compatibility
export const apiEndpoints = {
  auth: authApi,
  users: usersApi,
  studySets: studySetsApi,
  classes: classesApi,
  folders: foldersApi,
  progress: progressApi,
  ai: aiApi,
};

export type ApiEndpoints = typeof apiEndpoints;
