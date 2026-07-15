// AI Types
import type { z } from 'zod';
import type { generateFlashcardsSchema, generateSummarySchema, generateQuizSchema, magicNotesSchema, answerQuestionSchema } from '../schemas';

// ============ Common Types ============

export type AIProvider = 'openai' | 'gemini' | 'claude';
export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type QuizType = 'multiple_choice' | 'true_false';

// ============ Generated Content Types ============

export interface GeneratedCard {
  term: string;
  definition: string;
  hint?: string;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface AIMagicNotesResult {
  summary: string;
  flashcards: GeneratedCard[];
  keyPoints?: string[];
}

// ============ API Request Types ============

export interface GenerateFlashcardsRequest {
  content: string;
  cardCount?: number;
  difficulty?: Difficulty;
  includeHints?: boolean;
  provider?: AIProvider;
}

export interface GenerateSummaryRequest {
  content: string;
  maxLength?: number;
  provider?: AIProvider;
}

export interface GenerateQuizRequest {
  content: string;
  questionCount?: number;
  type?: QuizType;
  provider?: AIProvider;
}

export interface MagicNotesRequest {
  content: string;
  cardCount?: number;
  provider?: AIProvider;
}

export interface AnswerQuestionRequest {
  question: string;
  context: string;
  provider?: AIProvider;
}

export interface EnhanceFlashcardsRequest {
  cards: { term: string; definition: string }[];
  provider?: AIProvider;
}

// ============ API Response Types ============

export interface GenerateFlashcardsResponse {
  cards: GeneratedCard[];
}

export interface GenerateSummaryResponse {
  summary: string;
}

export interface GenerateQuizResponse {
  questions: GeneratedQuestion[];
}

export interface MagicNotesResponse {
  summary: string;
  flashcards: GeneratedCard[];
}

export interface AnswerResponse {
  answer: string;
}

export interface EnhanceFlashcardsResponse {
  cards: GeneratedCard[];
}

// ============ Form Data Types (inferred from schemas) ============

export type GenerateFlashcardsFormData = z.infer<typeof generateFlashcardsSchema>;
export type GenerateSummaryFormData = z.infer<typeof generateSummarySchema>;
export type GenerateQuizFormData = z.infer<typeof generateQuizSchema>;
export type MagicNotesFormData = z.infer<typeof magicNotesSchema>;
export type AnswerQuestionFormData = z.infer<typeof answerQuestionSchema>;

// ============ Component Props Types ============

export interface AIGeneratorProps {
  onAddCards?: (cards: GeneratedCard[]) => void;
  onClose?: () => void;
}

export interface AskQuizletProps {
  context?: string;
  onClose?: () => void;
}

export interface MagicNotesProps {
  onAddCards?: (cards: GeneratedCard[]) => void;
  onClose?: () => void;
}
