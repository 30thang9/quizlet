/**
 * Standard API Response Wrapper
 * Ensures consistent response format across all endpoints
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

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: ApiMeta;
}

/**
 * Success response factory
 */
export const ApiSuccess = <T>(data: T, meta?: ApiMeta): ApiResponse<T> => ({
  success: true,
  data,
  meta,
});

/**
 * Error response factory
 */
export const ApiError = (code: string, message: string, details?: Record<string, string[]>): ApiResponse => ({
  success: false,
  error: { code, message, details },
});
