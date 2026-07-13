'use client';

import { useState, useCallback } from 'react';
import { ApiResponse, ApiError } from '@/types/api/response';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (body?: any) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  options?: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
  },
): UseApiReturn<T> {
  const { immediate = false, onSuccess, onError } = options || {};

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (body?: any): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Add auth token if available
        const token = typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
          method,
          headers,
        };

        if (body && method !== 'GET') {
          config.body = JSON.stringify(body);
        }

        const response = await fetch(endpoint, config);
        const result: ApiResponse<T> = await response.json();

        if (!response.ok || !result.success) {
          throw result.error || {
            code: 'UNKNOWN_ERROR',
            message: 'An unexpected error occurred',
          };
        }

        setState({
          data: result.data as T,
          loading: false,
          error: null,
        });

        onSuccess?.(result.data as T);
        return result.data as T;
      } catch (err) {
        const error = err instanceof Error
          ? { code: 'NETWORK_ERROR', message: err.message }
          : (err as ApiError);

        setState({
          data: null,
          loading: false,
          error,
        });

        onError?.(error);
        return null;
      }
    },
    [endpoint, method, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Simplified API caller for one-off requests
 */
export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: HttpMethod;
    body?: any;
    token?: string;
  } = {},
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);
  const result: ApiResponse<T> = await response.json();

  return result;
}
