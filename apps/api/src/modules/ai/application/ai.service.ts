import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

export type AIProvider = 'openai' | 'gemini' | 'claude';

export interface GeneratedCard {
  term: string;
  definition: string;
  hint?: string;
}

export interface FlashcardGenerationOptions {
  content: string;
  cardCount?: number;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  includeHints?: boolean;
  provider?: AIProvider;
}

export interface SummaryOptions {
  content: string;
  maxLength?: number;
  provider?: AIProvider;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

@Injectable()
export class AiService {
  private openai: OpenAI;
  private genAI: GoogleGenerativeAI;
  private anthropic: Anthropic;
  private defaultProvider: AIProvider;

  constructor(private configService: ConfigService) {
    // Initialize OpenAI
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY') || '',
    });

    // Initialize Google Gemini
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY') || '',
    );

    // Initialize Anthropic Claude
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY') || '',
    });

    // Default provider
    this.defaultProvider = (this.configService.get<string>('AI_PROVIDER') as AIProvider) || 'openai';
  }

  /**
   * Generate flashcards from text content
   */
  async generateFlashcards(options: FlashcardGenerationOptions): Promise<GeneratedCard[]> {
    const { content, cardCount = 10, difficulty = 'intermediate', includeHints = true, provider } = options;

    if (!content || content.trim().length < 50) {
      throw new BadRequestException('Content must be at least 50 characters');
    }

    return this.executeAIAsync<GeneratedCard[]>(
      'generate flashcards',
      () => this.callAI(provider || this.defaultProvider, this.getFlashcardSystemPrompt(includeHints), this.getFlashcardUserPrompt(content, cardCount, difficulty), 'flashcards'),
      (result) => Array.isArray(result) ? result as GeneratedCard[] : null,
    );
  }

  /**
   * Generate a summary of content
   */
  async generateSummary(options: SummaryOptions): Promise<string> {
    const { content, maxLength = 200, provider } = options;

    if (!content || content.trim().length < 100) {
      throw new BadRequestException('Content must be at least 100 characters');
    }

    return this.executeAIAsync<string>(
      'generate summary',
      () => this.callAI(provider || this.defaultProvider, 'You summarize educational content concisely.', `Summarize in ${maxLength} chars:\n\n${content}`, 'summary'),
      (result) => typeof result === 'string' ? result : (Array.isArray(result) ? (result[0]?.definition || result[0]?.term || '') : ''),
    );
  }

  /**
   * Generate practice quiz questions
   */
  async generateQuiz(
    content: string,
    questionCount: number = 5,
    type: 'multiple_choice' | 'true_false' = 'multiple_choice',
    provider?: AIProvider,
  ): Promise<QuizQuestion[]> {
    if (!content || content.trim().length < 100) {
      throw new BadRequestException('Content must be at least 100 characters');
    }

    return this.executeAIAsync<QuizQuestion[]>(
      'generate quiz',
      () => this.callAI(provider || this.defaultProvider, this.getQuizSystemPrompt(type), this.getQuizUserPrompt(content, questionCount, type), 'quiz'),
      (result) => Array.isArray(result) ? result as QuizQuestion[] : null,
    );
  }

  /**
   * Enhance existing flashcards with AI suggestions
   */
  async enhanceFlashcards(cards: { term: string; definition: string }[], provider?: AIProvider): Promise<GeneratedCard[]> {
    const userPrompt = `Enhance these flashcards:\n\n${cards.map((c, i) => `${i + 1}. Term: ${c.term}\n   Definition: ${c.definition}`).join('\n\n')}`;

    return this.executeAIAsync<GeneratedCard[]>(
      'enhance flashcards',
      () => this.callAI(provider || this.defaultProvider, 'You enhance educational flashcards with better definitions, memory hints, and examples.', userPrompt, 'flashcards'),
      (result) => Array.isArray(result) ? result as GeneratedCard[] : null,
    );
  }

  /**
   * Answer questions about study content
   */
  async answerQuestion(question: string, context: string, provider?: AIProvider): Promise<string> {
    return this.executeAIAsync<string>(
      'answer question',
      () => this.callAI(provider || this.defaultProvider, 'You are a helpful AI tutor. Answer questions based on the provided study content.', `Context:\n${context}\n\nQuestion: ${question}`, 'text'),
      (result) => typeof result === 'string' ? result : JSON.stringify(result),
    );
  }

  /**
   * Execute AI operation with consistent error handling
   */
  private async executeAIAsync<T>(operation: string, fn: () => Promise<any>, validator: (result: any) => T | null): Promise<T> {
    try {
      const result = await fn();
      const validated = validator(result);
      if (validated === null) {
        throw new Error('Invalid response format');
      }
      return validated;
    } catch (error) {
      console.error(`AI ${operation} Error:`, error);
      throw new BadRequestException(`Failed to ${operation}`);
    }
  }

  /**
   * Call AI provider based on selection
   */
  private async callAI(provider: AIProvider, systemPrompt: string, userPrompt: string, outputType: 'flashcards' | 'quiz' | 'summary' | 'text'): Promise<GeneratedCard[] | QuizQuestion[] | string> {
    switch (provider) {
      case 'openai':
        return this.callOpenAI(systemPrompt, userPrompt, outputType);
      case 'gemini':
        return this.callGemini(systemPrompt, userPrompt, outputType);
      case 'claude':
        return this.callClaude(systemPrompt, userPrompt, outputType);
      default:
        return this.callOpenAI(systemPrompt, userPrompt, outputType);
    }
  }

  /**
   * OpenAI API call
   */
  private async callOpenAI(systemPrompt: string, userPrompt: string, outputType: string): Promise<GeneratedCard[] | QuizQuestion[] | string> {
    const model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini';

    const response = await this.openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    return this.parseAIResponse(content, outputType);
  }

  /**
   * Google Gemini API call
   */
  private async callGemini(systemPrompt: string, userPrompt: string, outputType: string): Promise<GeneratedCard[] | QuizQuestion[] | string> {
    const modelName = this.configService.get<string>('GEMINI_MODEL') || 'gemini-1.5-flash';
    const model = this.genAI.getGenerativeModel({ model: modelName });

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const content = response.text();

    if (!content) throw new Error('No response from Gemini');

    return this.parseAIResponse(content, outputType);
  }

  /**
   * Anthropic Claude API call
   */
  private async callClaude(systemPrompt: string, userPrompt: string, outputType: string): Promise<GeneratedCard[] | QuizQuestion[] | string> {
    const model = this.configService.get<string>('CLAUDE_MODEL') || 'claude-3-5-haiku-20241107';

    const response = await this.anthropic.messages.create({
      model,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    if (!content) throw new Error('No response from Claude');

    return this.parseAIResponse(content, outputType);
  }

  /**
   * Parse AI response based on output type
   */
  private parseAIResponse(content: string, outputType: string): GeneratedCard[] | QuizQuestion[] | string {
    // Clean markdown code blocks
    let jsonStr = content.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1');
    
    // Find JSON array
    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (arrayMatch) jsonStr = arrayMatch[0];

    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) {
        if (outputType === 'quiz') {
          return parsed.map((item) => ({
            question: item.question || '',
            options: item.options || [],
            correctIndex: item.correctIndex ?? 0,
          })).filter((item) => item.question && item.options.length >= 2) as QuizQuestion[];
        }
        return parsed.map((item) => ({
          term: item.term || item.question || item.name || '',
          definition: item.definition || item.answer || item.summary || item.text || '',
          hint: item.hint || item.memoryTip || undefined,
        })).filter((item) => item.term && item.definition) as GeneratedCard[];
      }
    } catch (e) {
      // If JSON parse fails, return as plain text
      if (outputType === 'text' || outputType === 'summary') {
        return content.trim();
      }
      console.error('JSON Parse Error:', e);
    }

    throw new BadRequestException('Failed to parse AI response');
  }

  // System prompts
  private getFlashcardSystemPrompt(includeHints: boolean): string {
    return `You are an expert educational content creator. Generate flashcards from content.

Rules:
- Each flashcard: { "term": string, "definition": string, "hint"?: string }
- ${includeHints ? 'Include memory hints when helpful' : 'Do not include hints'}
- Output ONLY valid JSON array
- Use the same language as input`;
  }

  private getFlashcardUserPrompt(content: string, cardCount: number, difficulty: string): string {
    const diffMap = {
      basic: 'simple, foundational terms',
      intermediate: 'intermediate level with concepts and definitions',
      advanced: 'complex concepts, examples, nuances',
    };
    return `Content:\n${content}\n\nGenerate ${cardCount} flashcards (${diffMap[difficulty as keyof typeof diffMap] || diffMap.intermediate}):`;
  }

  private getQuizSystemPrompt(type: 'multiple_choice' | 'true_false'): string {
    return `You create educational quizzes. ${type === 'multiple_choice' ? 'Multiple choice (4 options)' : 'True/False questions'}.
Output: [{ "question": string, "options": string[], "correctIndex": number }]`;
  }

  private getQuizUserPrompt(content: string, count: number, type: 'multiple_choice' | 'true_false'): string {
    return `Content:\n${content}\n\nGenerate ${count} ${type} questions:`;
  }
}
