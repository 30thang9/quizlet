/**
 * Study Set validation schemas using Zod
 */
import { z } from 'zod';

export const createStudySetSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  visibility: z
    .enum(['public', 'private', 'link'])
    .default('private'),
  folderId: z.string().optional(),
});

export const updateStudySetSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .nullable(),
  visibility: z
    .enum(['public', 'private', 'link'])
    .optional(),
  folderId: z.string().optional().nullable(),
});

export const createCardSchema = z.object({
  term: z
    .string()
    .min(1, 'Term is required')
    .max(1000, 'Term must be less than 1000 characters'),
  definition: z
    .string()
    .min(1, 'Definition is required')
    .max(5000, 'Definition must be less than 5000 characters'),
  hint: z
    .string()
    .max(500, 'Hint must be less than 500 characters')
    .optional(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  audioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const updateCardSchema = z.object({
  term: z
    .string()
    .min(1, 'Term is required')
    .max(1000, 'Term must be less than 1000 characters')
    .optional(),
  definition: z
    .string()
    .min(1, 'Definition is required')
    .max(5000, 'Definition must be less than 5000 characters')
    .optional(),
  hint: z
    .string()
    .max(500, 'Hint must be less than 500 characters')
    .optional()
    .nullable(),
  imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  audioUrl: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
});

export const bulkCreateCardsSchema = z.object({
  cards: z
    .array(createCardSchema)
    .min(1, 'At least one card is required')
    .max(500, 'Maximum 500 cards at a time'),
});

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, 'Folder name is required')
    .min(2, 'Folder name must be at least 2 characters')
    .max(100, 'Folder name must be less than 100 characters'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
    .optional(),
  parentId: z.string().optional(),
});

export const updateFolderSchema = z.object({
  name: z
    .string()
    .min(2, 'Folder name must be at least 2 characters')
    .max(100, 'Folder name must be less than 100 characters')
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
    .optional()
    .nullable(),
  parentId: z.string().optional().nullable(),
});

export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required').max(200),
  type: z.enum(['all', 'studySets', 'users', 'tags']).default('all'),
  sortBy: z.enum(['relevance', 'popular', 'recent']).default('relevance'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateStudySetInput = z.infer<typeof createStudySetSchema>;
export type UpdateStudySetInput = z.infer<typeof updateStudySetSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type BulkCreateCardsInput = z.infer<typeof bulkCreateCardsSchema>;
export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
