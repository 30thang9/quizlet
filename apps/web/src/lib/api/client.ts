/**
 * API Client - Re-export from new structure
 * @deprecated Use @/shared/lib/api/client for the base client
 *           Use @/lib/api/endpoints for apiEndpoints
 */
export { api } from '@/shared/lib/api/client';
export { apiEndpoints, authApi, usersApi, studySetsApi, classesApi, foldersApi, progressApi, aiApi } from './endpoints';
export type { ApiEndpoints } from './endpoints';
