'use client';

import { useState, useCallback } from 'react';
import { aiApi } from '../api/ai.api';
import type { AnswerQuestionRequest, AnswerResponse } from '../types';

export function useAnswerQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answer = useCallback(async (data: AnswerQuestionRequest): Promise<AnswerResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      return await aiApi.answer(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to get answer');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { answer, loading, error };
}
