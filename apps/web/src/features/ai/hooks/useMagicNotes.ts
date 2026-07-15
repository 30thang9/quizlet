'use client';

import { useState, useCallback } from 'react';
import { aiApi } from '../api/ai.api';
import type { MagicNotesRequest, MagicNotesResponse } from '../types';

export function useMagicNotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (data: MagicNotesRequest): Promise<MagicNotesResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      return await aiApi.magicNotes(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate Magic Notes');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error };
}
