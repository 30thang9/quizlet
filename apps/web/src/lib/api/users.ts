/**
 * Users API functions
 */
import { api } from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    studySetsCount: number;
    followersCount: number;
    followingCount: number;
    cardsStudied: number;
    studyTime: number;
  };
}

export interface UpdateUserRequest {
  name?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UserProfile extends User {
  isFollowing?: boolean;
}

export const usersApi = {
  me: async (): Promise<User> => {
    return api.get('/users/me');
  },

  update: async (data: UpdateUserRequest): Promise<User> => {
    return api.patch('/users/me', data);
  },

  getProfile: async (userId: string): Promise<UserProfile> => {
    return api.get(`/users/${userId}`);
  },

  getStudySets: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ data: any[]; total: number }> => {
    return api.get(`/users/${userId}/study-sets`, { params });
  },

  follow: async (userId: string): Promise<void> => {
    return api.post(`/users/${userId}/follow`);
  },

  unfollow: async (userId: string): Promise<void> => {
    return api.delete(`/users/${userId}/follow`);
  },

  getFollowers: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ data: User[]; total: number }> => {
    return api.get(`/users/${userId}/followers`, { params });
  },

  getFollowing: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ data: User[]; total: number }> => {
    return api.get(`/users/${userId}/following`, { params });
  },
};
