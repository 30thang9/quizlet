/**
 * AI Service - Business Logic Layer
 * Xử lý data mapping, transform, error handling
 */
import { aiApi } from '../api/ai.api';
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

/**
 * Generate flashcards service
 */
export async function generateFlashcardsService(
  data: GenerateFlashcardsRequest
): Promise<{ success: boolean; result?: GenerateFlashcardsResponse; error?: string }> {
  try {
    const result = await aiApi.generateFlashcards(data);
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate flashcards',
    };
  }
}

/**
 * Generate summary service
 */
export async function generateSummaryService(
  data: GenerateSummaryRequest
): Promise<{ success: boolean; result?: GenerateSummaryResponse; error?: string }> {
  try {
    const result = await aiApi.generateSummary(data);
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate summary',
    };
  }
}

/**
 * Generate quiz service
 */
export async function generateQuizService(
  data: GenerateQuizRequest
): Promise<{ success: boolean; result?: GenerateQuizResponse; error?: string }> {
  try {
    const result = await aiApi.generateQuiz(data);
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate quiz',
    };
  }
}

/**
 * Enhance flashcards service
 */
export async function enhanceFlashcardsService(
  data: EnhanceFlashcardsRequest
): Promise<{ success: boolean; result?: EnhanceFlashcardsResponse; error?: string }> {
  try {
    const result = await aiApi.enhanceFlashcards(data);
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to enhance flashcards',
    };
  }
}

/**
 * Answer question service
 */
export async function answerQuestionService(
  data: AnswerQuestionRequest
): Promise<{ success: boolean; result?: AnswerResponse; error?: string }> {
  try {
    const result = await aiApi.answer(data);
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get answer',
    };
  }
}

/**
 * Magic notes service
 */
export async function magicNotesService(
  data: MagicNotesRequest
): Promise<{ success: boolean; result?: MagicNotesResponse; error?: string }> {
  try {
    const result = await aiApi.magicNotes(data);
    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate Magic Notes',
    };
  }
}
