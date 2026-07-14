/**
 * Study Sets API functions
 */
import { api } from './client';

export interface StudySet {
  id: string;
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'link';
  userId: string;
  folderId?: string;
  cardCount: number;
  likeCount: number;
  copyCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  cards?: Card[];
  tags?: Tag[];
}

export interface Card {
  id: string;
  term: string;
  definition: string;
  hint?: string;
  imageUrl?: string;
  audioUrl?: string;
  studySetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface CreateStudySetRequest {
  title: string;
  description?: string;
  visibility?: 'public' | 'private' | 'link';
  folderId?: string;
}

export interface UpdateStudySetRequest {
  title?: string;
  description?: string;
  visibility?: 'public' | 'private' | 'link';
  folderId?: string;
}

export interface CreateCardRequest {
  term: string;
  definition: string;
  hint?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface UpdateCardRequest {
  term?: string;
  definition?: string;
  hint?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface StudySetListParams {
  page?: number;
  limit?: number;
  userId?: string;
  folderId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

export const studySetsApi = {
  list: async (params?: StudySetListParams): Promise<{ data: StudySet[]; total: number }> => {
    return api.get('/study-sets', { params });
  },

  get: async (id: string): Promise<StudySet> => {
    return api.get(`/study-sets/${id}`);
  },

  create: async (data: CreateStudySetRequest): Promise<StudySet> => {
    return api.post('/study-sets', data);
  },

  update: async (id: string, data: UpdateStudySetRequest): Promise<StudySet> => {
    return api.patch(`/study-sets/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete(`/study-sets/${id}`);
  },

  like: async (id: string): Promise<void> => {
    return api.post(`/study-sets/${id}/like`);
  },

  unlike: async (id: string): Promise<void> => {
    return api.delete(`/study-sets/${id}/like`);
  },

  copy: async (id: string): Promise<StudySet> => {
    return api.post(`/study-sets/${id}/copy`);
  },

  // Card operations
  getCards: async (studySetId: string): Promise<Card[]> => {
    return api.get(`/study-sets/${studySetId}/cards`);
  },

  createCard: async (studySetId: string, data: CreateCardRequest): Promise<Card> => {
    return api.post(`/study-sets/${studySetId}/cards`, data);
  },

  updateCard: async (cardId: string, data: UpdateCardRequest): Promise<Card> => {
    return api.patch(`/cards/${cardId}`, data);
  },

  deleteCard: async (cardId: string): Promise<void> => {
    return api.delete(`/cards/${cardId}`);
  },

  bulkCreateCards: async (studySetId: string, cards: CreateCardRequest[]): Promise<Card[]> => {
    return api.post(`/study-sets/${studySetId}/cards/bulk`, { cards });
  },
};
