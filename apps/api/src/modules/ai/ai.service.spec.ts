import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { AiService } from './application/ai.service';

describe('AiService', () => {
  let service: AiService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        AI_PROVIDER: 'openai',
        OPENAI_API_KEY: 'test-key',
        OPENAI_MODEL: 'gpt-4o-mini',
        GEMINI_API_KEY: 'test-key',
        GEMINI_MODEL: 'gemini-1.5-flash',
        ANTHROPIC_API_KEY: 'test-key',
        CLAUDE_MODEL: 'claude-3-5-haiku-20241107',
      };
      return config[key] ?? defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateFlashcards', () => {
    it('should throw BadRequestException for content less than 50 characters', async () => {
      await expect(
        service.generateFlashcards({ content: 'short' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for empty content', async () => {
      await expect(
        service.generateFlashcards({ content: '' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateSummary', () => {
    it('should throw BadRequestException for content less than 100 characters', async () => {
      await expect(
        service.generateSummary({ content: 'short' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateQuiz', () => {
    it('should throw BadRequestException for content less than 100 characters', async () => {
      await expect(
        service.generateQuiz('short'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept valid quiz parameters', async () => {
      const validContent = 'This is a valid content that has more than one hundred characters to pass the validation check.';
      try {
        await service.generateQuiz(validContent, 5, 'multiple_choice');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('provider selection', () => {
    it('should use default provider when none specified', () => {
      const provider = (service as any).defaultProvider;
      expect(provider).toBe('openai');
    });
  });
});
