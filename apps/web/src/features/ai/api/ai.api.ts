/**
 * AI API - Layer giao tiếp HTTP
 * Chỉ biết endpoint, không biết business logic
 * Types được định nghĩa trong ../types/
 */
import { api } from '@/shared/lib/api/client';
import type {
  GenerateFlashcardsRequest,
  GenerateFlashcardsResponse,
  GenerateSummaryRequest,
  GenerateSummaryResponse,
  GenerateQuizRequest,
  GenerateQuizResponse,
  MagicNotesRequest,
  MagicNotesResponse,
  AnswerQuestionRequest,
  AnswerResponse,
  EnhanceFlashcardsRequest,
  EnhanceFlashcardsResponse,
} from '../types';

export const aiApi = {
  /**
   * POST /ai/generate-flashcards
   */
  generateFlashcards: async (data: GenerateFlashcardsRequest): Promise<GenerateFlashcardsResponse> => {
    return api.post<GenerateFlashcardsResponse>('/ai/generate-flashcards', data);
  },

  /**
   * POST /ai/generate-summary
   */
  generateSummary: async (data: GenerateSummaryRequest): Promise<GenerateSummaryResponse> => {
    return api.post<GenerateSummaryResponse>('/ai/generate-summary', data);
  },

  /**
   * POST /ai/generate-quiz
   */
  generateQuiz: async (data: GenerateQuizRequest): Promise<GenerateQuizResponse> => {
    return api.post<GenerateQuizResponse>('/ai/generate-quiz', data);
  },

  /**
   * POST /ai/enhance-flashcards
   */
  enhanceFlashcards: async (data: EnhanceFlashcardsRequest): Promise<EnhanceFlashcardsResponse> => {
    return api.post<EnhanceFlashcardsResponse>('/ai/enhance-flashcards', data);
  },

  /**
   * POST /ai/answer
   */
  answer: async (data: AnswerQuestionRequest): Promise<AnswerResponse> => {
    return api.post<AnswerResponse>('/ai/answer', data);
  },

  /**
   * POST /ai/magic-notes
   */
  magicNotes: async (data: MagicNotesRequest): Promise<MagicNotesResponse> => {
    return api.post<MagicNotesResponse>('/ai/magic-notes', data);
  },
};
