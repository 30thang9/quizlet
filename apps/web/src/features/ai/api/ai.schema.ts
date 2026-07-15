// AI Validation Schemas (Zod)
import { z } from 'zod';

// ============ Generate Flashcards Schema ============

export const generateFlashcardsSchema = z.object({
  content: z.string().min(50, 'Content must be at least 50 characters'),
  cardCount: z.number().min(1).max(50).default(10),
  difficulty: z.enum(['basic', 'intermediate', 'advanced']).default('intermediate'),
  includeHints: z.boolean().default(true),
  provider: z.enum(['openai', 'gemini', 'claude']).default('openai'),
});

export const generateFlashcardsMutationSchema = generateFlashcardsSchema.extend({
  content: z.string().min(50, 'Content must be at least 50 characters for flashcard generation'),
});

// ============ Generate Summary Schema ============

export const generateSummarySchema = z.object({
  content: z.string().min(100, 'Content must be at least 100 characters'),
  maxLength: z.number().min(50).max(1000).optional(),
  provider: z.enum(['openai', 'gemini', 'claude']).default('openai'),
});

// ============ Generate Quiz Schema ============

export const generateQuizSchema = z.object({
  content: z.string().min(50, 'Content must be at least 50 characters'),
  questionCount: z.number().min(1).max(20).default(5),
  type: z.enum(['multiple_choice', 'true_false']).default('multiple_choice'),
  provider: z.enum(['openai', 'gemini', 'claude']).default('openai'),
});

// ============ Magic Notes Schema ============

export const magicNotesSchema = z.object({
  content: z.string().min(100, 'Content must be at least 100 characters for Magic Notes'),
  cardCount: z.number().min(1).max(50).default(10),
  provider: z.enum(['openai', 'gemini', 'claude']).default('openai'),
});

// ============ Answer Question Schema ============

export const answerQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  context: z.string().min(1, 'Context is required'),
  provider: z.enum(['openai', 'gemini', 'claude']).default('openai'),
});

// ============ Enhance Flashcards Schema ============

export const enhanceFlashcardsSchema = z.object({
  cards: z.array(z.object({
    term: z.string().min(1),
    definition: z.string().min(1),
  })).min(1, 'At least one card is required'),
  provider: z.enum(['openai', 'gemini', 'claude']).default('openai'),
});
