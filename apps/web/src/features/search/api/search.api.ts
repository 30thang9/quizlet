/**
 * Search API - Layer giao tiếp HTTP
 */
import { api } from '@/shared/lib/api/client';
import type { SearchResponse } from '../types';

export const searchApi = {
  /**
   * GET /search/study-sets
   */
  searchStudySets: async (params: {
    q: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }): Promise<SearchResponse> => {
    return api.get<SearchResponse>('/search/study-sets', { params });
  },

  /**
   * GET /search/users
   */
  searchUsers: async (params: {
    q: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: any[]; total: number }> => {
    return api.get('/search/users', { params });
  },
};
