// Classes Validation Schemas (Zod)
import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const updateClassSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const addMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'member']).default('member'),
});
