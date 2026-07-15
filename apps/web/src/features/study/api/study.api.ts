/**
 * Study API - Layer giao tiếp HTTP
 * Chỉ biết endpoint, không biết business logic
 * Types được định nghĩa trong ../types/
 */
import { api } from '@/shared/lib/api/client';
import type { Card, StudySet, StudySession, CardProgress, StudyStats } from '../types';

// ============ Progress API ============

export const progressApi = {
  /**
   * POST /progress/sessions
   */
  createSession: async (data: { studySetId?: string; mode?: string }): Promise<StudySession> => {
    return api.post<StudySession>('/progress/sessions', data);
  },

  /**
   * PATCH /progress/sessions/:sessionId
   */
  endSession: async (sessionId: string, data: {
    cardsStudied: number;
    correctCount: number;
    timeSpentSeconds: number;
    mistakes: number;
    score?: number;
  }): Promise<void> => {
    return api.patch(`/progress/sessions/${sessionId}`, data);
  },

  /**
   * POST /progress/review
   */
  reviewCard: async (data: {
    cardId: string;
    studySessionId?: string;
    quality: number;
  }): Promise<CardProgress> => {
    return api.post<CardProgress>('/progress/review', data);
  },

  /**
   * GET /progress/cards/:cardId
   */
  getCardProgress: async (cardId: string): Promise<CardProgress> => {
    return api.get<CardProgress>(`/progress/cards/${cardId}`);
  },

  /**
   * GET /progress/due
   */
  getDueCards: async (params?: { studySetId?: string; limit?: number }): Promise<Card[]> => {
    return api.get<Card[]>('/progress/due', { params });
  },

  /**
   * GET /progress/study-sets/:studySetId
   */
  getStudySetProgress: async (studySetId: string): Promise<any> => {
    return api.get(`/progress/study-sets/${studySetId}`);
  },

  /**
   * GET /progress/stats
   */
  getStats: async (): Promise<StudyStats> => {
    return api.get<StudyStats>('/progress/stats');
  },
};

// ============ Study Set API ============

export const studySetApi = {
  /**
   * GET /study-sets/:id
   */
  get: async (id: string): Promise<StudySet> => {
    return api.get<StudySet>(`/study-sets/${id}`);
  },

  /**
   * POST /study-sets
   */
  create: async (data: {
    title: string;
    description?: string;
    visibility?: string;
    folderId?: string;
  }): Promise<StudySet> => {
    return api.post<StudySet>('/study-sets', data);
  },

  /**
   * PATCH /study-sets/:id
   */
  update: async (id: string, data: {
    title?: string;
    description?: string;
    folderId?: string;
  }): Promise<StudySet> => {
    return api.patch<StudySet>(`/study-sets/${id}`, data);
  },

  /**
   * DELETE /study-sets/:id
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/study-sets/${id}`);
  },

  /**
   * POST /study-sets/:id/cards
   */
  addCard: async (studySetId: string, data: {
    term: string;
    definition: string;
    hint?: string;
  }): Promise<Card> => {
    return api.post<Card>(`/study-sets/${studySetId}/cards`, data);
  },

  /**
   * PATCH /study-sets/:studySetId/cards/:cardId
   */
  updateCard: async (studySetId: string, cardId: string, data: {
    term?: string;
    definition?: string;
    hint?: string;
  }): Promise<Card> => {
    return api.patch<Card>(`/study-sets/${studySetId}/cards/${cardId}`, data);
  },

  /**
   * DELETE /study-sets/:studySetId/cards/:cardId
   */
  deleteCard: async (studySetId: string, cardId: string): Promise<void> => {
    return api.delete(`/study-sets/${studySetId}/cards/${cardId}`);
  },

  /**
   * POST /study-sets/:id/import
   */
  importCards: async (studySetId: string, cards: {
    term: string;
    definition: string;
    hint?: string;
  }[]): Promise<{ imported: number }> => {
    return api.post(`/study-sets/${studySetId}/import`, { cards });
  },

  /**
   * GET /study-sets/:id/export
   */
  exportCards: async (studySetId: string, format: 'csv' | 'json' | 'pdf'): Promise<Blob> => {
    const response = await fetch(`/api/v1/study-sets/${studySetId}/export?format=${format}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
      },
    });
    return response.blob();
  },

  /**
   * POST /study-sets/:id/like
   */
  like: async (id: string): Promise<void> => {
    return api.post(`/study-sets/${id}/like`);
  },

  /**
   * DELETE /study-sets/:id/like
   */
  unlike: async (id: string): Promise<void> => {
    return api.delete(`/study-sets/${id}/like`);
  },

  /**
   * POST /study-sets/:id/copy
   */
  copy: async (id: string): Promise<StudySet> => {
    return api.post<StudySet>(`/study-sets/${id}/copy`);
  },
};

// ============ Combined API ============

export const studyApi = {
  progress: progressApi,
  studySet: studySetApi,
};
