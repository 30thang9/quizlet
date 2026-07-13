'use client';

import { useState, useCallback } from 'react';
import { apiEndpoints } from '@/lib/api/client';

export interface StudySession {
  id: string;
  studySetId?: string;
  mode: string;
  startedAt: Date;
  cardsStudied?: number;
  correctCount?: number;
  timeSpentSeconds?: number;
  mistakes?: number;
  score?: number;
}

export interface CardProgress {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
  lastReviewed?: Date;
}

export interface StudyStats {
  totalCardsStudied: number;
  totalStudyTime: number;
  averageScore: number;
  studyStreak: number;
  cardsLearned: number;
  cardsMastered: number;
  dueCardsCount: number;
}

interface CreateSessionParams {
  studySetId?: string;
  mode?: string;
}

interface EndSessionParams {
  cardsStudied: number;
  correctCount: number;
  timeSpentSeconds: number;
  mistakes: number;
  score?: number;
}

interface ReviewCardParams {
  cardId: string;
  studySessionId?: string;
  quality: number;
}

export function useProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (params: CreateSessionParams): Promise<StudySession | null> => {
    setLoading(true);
    setError(null);
    try {
      const session = await apiEndpoints.progress.createSession(params);
      return session as unknown as StudySession;
    } catch (err: any) {
      setError(err.message || 'Failed to create session');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const endSession = useCallback(async (sessionId: string, params: EndSessionParams): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await apiEndpoints.progress.endSession(sessionId, params);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to end session');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const reviewCard = useCallback(async (params: ReviewCardParams): Promise<CardProgress | null> => {
    setLoading(true);
    setError(null);
    try {
      const progress = await apiEndpoints.progress.reviewCard(params);
      return progress as unknown as CardProgress;
    } catch (err: any) {
      setError(err.message || 'Failed to review card');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCardProgress = useCallback(async (cardId: string): Promise<CardProgress | null> => {
    setLoading(true);
    setError(null);
    try {
      const progress = await apiEndpoints.progress.getCardProgress(cardId);
      return progress as unknown as CardProgress;
    } catch (err: any) {
      setError(err.message || 'Failed to get card progress');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDueCards = useCallback(async (params?: { studySetId?: string; limit?: number }): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiEndpoints.progress.getDueCards(params);
      return result as unknown as any[];
    } catch (err: any) {
      setError(err.message || 'Failed to get due cards');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudySetProgress = useCallback(async (studySetId: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const progress = await apiEndpoints.progress.getStudySetProgress(studySetId);
      return progress;
    } catch (err: any) {
      setError(err.message || 'Failed to get study set progress');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(async (): Promise<StudyStats | null> => {
    setLoading(true);
    setError(null);
    try {
      const stats = await apiEndpoints.progress.getStats();
      return stats as unknown as StudyStats;
    } catch (err: any) {
      setError(err.message || 'Failed to get stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createSession,
    endSession,
    reviewCard,
    getCardProgress,
    getDueCards,
    getStudySetProgress,
    getStats,
  };
}
