// Study Validation Schemas (Zod)
import { z } from 'zod';

// ============ Card Schemas ============

export const createCardSchema = z.object({
  term: z.string().min(1, 'Term is required'),
  definition: z.string().min(1, 'Definition is required'),
  hint: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  audioUrl: z.string().url().optional().or(z.literal('')),
});

export const updateCardSchema = createCardSchema.partial();

export const cardSchema = createCardSchema;

// ============ Study Session Schemas ============

export const createSessionSchema = z.object({
  studySetId: z.string().optional(),
  mode: z.enum(['learn', 'flashcards', 'match', 'quiz', 'test']),
});

export const endSessionSchema = z.object({
  cardsStudied: z.number().min(0),
  correctCount: z.number().min(0),
  timeSpentSeconds: z.number().min(0),
  mistakes: z.number().min(0),
  score: z.number().min(0).max(100).optional(),
});

export const reviewCardSchema = z.object({
  cardId: z.string().min(1),
  studySessionId: z.string().optional(),
  quality: z.number().min(0).max(5),
});

// ============ Study Set Schemas ============

export const createStudySetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['public', 'private', 'link']).default('private'),
  folderId: z.string().optional(),
});

export const updateStudySetSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['public', 'private', 'link']).optional(),
  folderId: z.string().nullable().optional(),
});

// ============ Import/Export Schemas ============

export const importCardsSchema = z.object({
  cards: z.array(z.object({
    term: z.string().min(1),
    definition: z.string().min(1),
    hint: z.string().optional(),
  })).min(1, 'At least one card is required'),
  studySetId: z.string().optional(),
});

export const exportCardsSchema = z.object({
  studySetId: z.string().min(1),
  format: z.enum(['csv', 'json', 'pdf']).default('csv'),
});
