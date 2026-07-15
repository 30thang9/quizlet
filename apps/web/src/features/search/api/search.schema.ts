// Search Validation Schemas (Zod)
import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
  sortBy: z.enum(['popular', 'recent', 'alphabetical']).optional(),
  visibility: z.enum(['public', 'private', 'all']).optional(),
});

export const searchFiltersSchema = z.object({
  sortBy: z.enum(['popular', 'recent', 'alphabetical']).default('popular'),
  visibility: z.enum(['public', 'private', 'all']).default('all'),
  cardCountMin: z.number().min(0).optional(),
  cardCountMax: z.number().min(0).optional(),
});
