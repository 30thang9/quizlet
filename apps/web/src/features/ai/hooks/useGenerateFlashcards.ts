'use client';

import { useState, useCallback } from 'react';
import { aiApi } from '../api/ai.api';
import type { GenerateFlashcardsRequest, GenerateFlashcardsResponse } from '../types';

export function useGenerateFlashcards() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (data: GenerateFlashcardsRequest): Promise<GenerateFlashcardsResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      return await aiApi.generateFlashcards(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate flashcards');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { generate, loading, error, reset };
}
