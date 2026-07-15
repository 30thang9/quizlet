/**
 * AI Queries - React Query Layer
 * Quản lý cache, loading, error, retry
 */
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../api/ai.api';
import type {
  GenerateFlashcardsRequest,
  GenerateSummaryRequest,
  GenerateQuizRequest,
  MagicNotesRequest,
  AnswerQuestionRequest,
  EnhanceFlashcardsRequest,
} from '../types';

// Query Keys
export const aiKeys = {
  all: ['ai'] as const,
  generateFlashcards: (variables: GenerateFlashcardsRequest) => [...aiKeys.all, 'generateFlashcards', variables] as const,
  generateSummary: (variables: GenerateSummaryRequest) => [...aiKeys.all, 'generateSummary', variables] as const,
  generateQuiz: (variables: GenerateQuizRequest) => [...aiKeys.all, 'generateQuiz', variables] as const,
  magicNotes: (variables: MagicNotesRequest) => [...aiKeys.all, 'magicNotes', variables] as const,
};

// ============ MUTATIONS ============

/**
 * Generate flashcards mutation
 */
export function useGenerateFlashcardsMutation() {
  return useMutation({
    mutationFn: (data: GenerateFlashcardsRequest) => aiApi.generateFlashcards(data),
  });
}

/**
 * Generate summary mutation
 */
export function useGenerateSummaryMutation() {
  return useMutation({
    mutationFn: (data: GenerateSummaryRequest) => aiApi.generateSummary(data),
  });
}

/**
 * Generate quiz mutation
 */
export function useGenerateQuizMutation() {
  return useMutation({
    mutationFn: (data: GenerateQuizRequest) => aiApi.generateQuiz(data),
  });
}

/**
 * Enhance flashcards mutation
 */
export function useEnhanceFlashcardsMutation() {
  return useMutation({
    mutationFn: (data: EnhanceFlashcardsRequest) => aiApi.enhanceFlashcards(data),
  });
}

/**
 * Answer question mutation
 */
export function useAnswerQuestionMutation() {
  return useMutation({
    mutationFn: (data: AnswerQuestionRequest) => aiApi.answer(data),
  });
}

/**
 * Magic notes mutation
 */
export function useMagicNotesMutation() {
  return useMutation({
    mutationFn: (data: MagicNotesRequest) => aiApi.magicNotes(data),
  });
}
