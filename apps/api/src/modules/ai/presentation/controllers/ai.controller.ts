import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { AiService, GeneratedCard, QuizQuestion, AIProvider } from '../../application/ai.service';

class GenerateFlashcardsDto {
  content: string;
  cardCount?: number;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  includeHints?: boolean;
  provider?: AIProvider;
}

class GenerateSummaryDto {
  content: string;
  maxLength?: number;
  provider?: AIProvider;
}

class GenerateQuizDto {
  content: string;
  questionCount?: number;
  type?: 'multiple_choice' | 'true_false';
  provider?: AIProvider;
}

class EnhanceFlashcardsDto {
  cards: { term: string; definition: string }[];
  provider?: AIProvider;
}

class AnswerQuestionDto {
  question: string;
  context: string;
  provider?: AIProvider;
}

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * Generate flashcards from text content
   * POST /ai/generate-flashcards
   */
  @Post('generate-flashcards')
  @HttpCode(HttpStatus.OK)
  async generateFlashcards(@Body() dto: GenerateFlashcardsDto): Promise<GeneratedCard[]> {
    return this.aiService.generateFlashcards({
      content: dto.content,
      cardCount: dto.cardCount || 10,
      difficulty: dto.difficulty || 'intermediate',
      includeHints: dto.includeHints ?? true,
      provider: dto.provider,
    });
  }

  /**
   * Generate summary from content
   * POST /ai/generate-summary
   */
  @Post('generate-summary')
  @HttpCode(HttpStatus.OK)
  async generateSummary(@Body() dto: GenerateSummaryDto): Promise<{ summary: string }> {
    const summary = await this.aiService.generateSummary({
      content: dto.content,
      maxLength: dto.maxLength || 200,
      provider: dto.provider,
    });
    return { summary };
  }

  /**
   * Generate quiz questions from content
   * POST /ai/generate-quiz
   */
  @Post('generate-quiz')
  @HttpCode(HttpStatus.OK)
  async generateQuiz(@Body() dto: GenerateQuizDto): Promise<{ questions: QuizQuestion[] }> {
    const questions = await this.aiService.generateQuiz(
      dto.content,
      dto.questionCount || 5,
      dto.type || 'multiple_choice',
      dto.provider,
    );
    return { questions };
  }

  /**
   * Enhance existing flashcards
   * POST /ai/enhance-flashcards
   */
  @Post('enhance-flashcards')
  @HttpCode(HttpStatus.OK)
  async enhanceFlashcards(@Body() dto: EnhanceFlashcardsDto): Promise<GeneratedCard[]> {
    return this.aiService.enhanceFlashcards(dto.cards, dto.provider);
  }

  /**
   * Answer question about study content
   * POST /ai/answer
   */
  @Post('answer')
  @HttpCode(HttpStatus.OK)
  async answerQuestion(@Body() dto: AnswerQuestionDto): Promise<{ answer: string }> {
    const answer = await this.aiService.answerQuestion(dto.question, dto.context, dto.provider);
    return { answer };
  }

  /**
   * Magic Notes - Generate flashcards and summary from notes
   * POST /ai/magic-notes
   */
  @Post('magic-notes')
  @HttpCode(HttpStatus.OK)
  async magicNotes(@Body() dto: { content: string; cardCount?: number; provider?: AIProvider }): Promise<{
    summary: string;
    flashcards: GeneratedCard[];
  }> {
    const [summary, flashcards] = await Promise.all([
      this.aiService.generateSummary({ content: dto.content, provider: dto.provider }),
      this.aiService.generateFlashcards({
        content: dto.content,
        cardCount: dto.cardCount || 10,
        provider: dto.provider,
      }),
    ]);

    return { summary, flashcards };
  }
}
