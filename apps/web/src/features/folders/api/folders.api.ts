/**
 * Folders API - Layer giao tiếp HTTP
 */
import { api } from '@/shared/lib/api/client';
import type { Folder, FolderTree } from '../types';

export const foldersApi = {
  /**
   * GET /folders
   */
  list: async (params?: { parentId?: string; page?: number; limit?: number }): Promise<{ items: Folder[]; total: number }> => {
    return api.get('/folders', { params });
  },

  /**
   * GET /folders/tree
   */
  getTree: async (): Promise<FolderTree> => {
    return api.get<FolderTree>('/folders/tree');
  },

  /**
   * GET /folders/:id
   */
  get: async (id: string): Promise<Folder> => {
    return api.get<Folder>(`/folders/${id}`);
  },

  /**
   * POST /folders
   */
  create: async (data: { name: string; parentId?: string; color?: string }): Promise<Folder> => {
    return api.post<Folder>('/folders', data);
  },

  /**
   * PATCH /folders/:id
   */
  update: async (id: string, data: { name?: string; parentId?: string; color?: string }): Promise<Folder> => {
    return api.patch<Folder>(`/folders/${id}`, data);
  },

  /**
   * DELETE /folders/:id
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/folders/${id}`);
  },

  /**
   * GET /folders/:id/study-sets
   */
  getStudySets: async (id: string): Promise<any[]> => {
    return api.get(`/folders/${id}/study-sets`);
  },

  /**
   * POST /folders/:id/study-sets
   */
  addStudySet: async (id: string, studySetId: string): Promise<void> => {
    return api.post(`/folders/${id}/study-sets`, { studySetId });
  },

  /**
   * DELETE /folders/:id/study-sets/:studySetId
   */
  removeStudySet: async (id: string, studySetId: string): Promise<void> => {
    return api.delete(`/folders/${id}/study-sets/${studySetId}`);
  },
};
