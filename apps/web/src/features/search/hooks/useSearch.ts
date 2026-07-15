'use client';

import { useState, useCallback } from 'react';
import { searchApi } from '../api/search.api';
import type { SearchResult } from '../types';

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, sortBy?: string) => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchApi.searchStudySets({
        q: query,
        sortBy,
      });
      setResults(response.studySets || []);
      return response.studySets || [];
    } catch (err: any) {
      setError(err?.message || 'Search failed');
      setResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { search, results, loading, error, reset };
}
