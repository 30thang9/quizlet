/**
 * Classes API - Layer giao tiếp HTTP
 */
import { api } from '@/shared/lib/api/client';
import type { Class, ClassMember, ClassStudySet } from '../types';

export const classesApi = {
  /**
   * GET /classes
   */
  list: async (params?: { page?: number; limit?: number }): Promise<{ items: Class[]; total: number }> => {
    return api.get('/classes', { params });
  },

  /**
   * GET /classes/:id
   */
  get: async (id: string): Promise<Class> => {
    return api.get<Class>(`/classes/${id}`);
  },

  /**
   * POST /classes
   */
  create: async (data: { name: string; description?: string }): Promise<Class> => {
    return api.post<Class>('/classes', data);
  },

  /**
   * PATCH /classes/:id
   */
  update: async (id: string, data: { name?: string; description?: string }): Promise<Class> => {
    return api.patch<Class>(`/classes/${id}`, data);
  },

  /**
   * DELETE /classes/:id
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/classes/${id}`);
  },

  /**
   * GET /classes/:id/members
   */
  getMembers: async (id: string): Promise<ClassMember[]> => {
    return api.get<ClassMember[]>(`/classes/${id}/members`);
  },

  /**
   * POST /classes/:id/members
   */
  addMember: async (id: string, data: { email: string; role?: string }): Promise<ClassMember> => {
    return api.post<ClassMember>(`/classes/${id}/members`, data);
  },

  /**
   * DELETE /classes/:id/members/:memberId
   */
  removeMember: async (id: string, memberId: string): Promise<void> => {
    return api.delete(`/classes/${id}/members/${memberId}`);
  },

  /**
   * GET /classes/:id/study-sets
   */
  getStudySets: async (id: string): Promise<ClassStudySet[]> => {
    return api.get<ClassStudySet[]>(`/classes/${id}/study-sets`);
  },

  /**
   * POST /classes/:id/study-sets
   */
  addStudySet: async (id: string, studySetId: string): Promise<void> => {
    return api.post(`/classes/${id}/study-sets`, { studySetId });
  },

  /**
   * DELETE /classes/:id/study-sets/:studySetId
   */
  removeStudySet: async (id: string, studySetId: string): Promise<void> => {
    return api.delete(`/classes/${id}/study-sets/${studySetId}`);
  },
};
