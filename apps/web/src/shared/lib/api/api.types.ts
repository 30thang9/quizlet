/**
 * Standard API Response Types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: ApiMeta;
}

export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is ApiResponse<T> & { data: T } {
  return response.success === true && response.data !== undefined;
}

export function isPaginatedResponse<T>(
  response: ApiResponse<T[]>,
): response is ApiResponse<T[]> & { meta: ApiMeta } {
  return response.meta !== undefined;
}
