// Folders Validation Schemas (Zod)
import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  parentId: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  parentId: z.string().nullable().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
});
