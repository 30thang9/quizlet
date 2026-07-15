'use client';

import { useState, useCallback } from 'react';
import { progressApi } from '../api/study.api';
import type { StudySession, CardProgress, StudyStats } from '../types';

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
      const session = await progressApi.createSession(params);
      return session;
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
      await progressApi.endSession(sessionId, params);
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
      const progress = await progressApi.reviewCard(params);
      return progress;
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
      const progress = await progressApi.getCardProgress(cardId);
      return progress;
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
      const result = await progressApi.getDueCards(params);
      return result;
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
      const progress = await progressApi.getStudySetProgress(studySetId);
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
      const stats = await progressApi.getStats();
      return stats;
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

export type { CreateSessionParams, EndSessionParams, ReviewCardParams };
