import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-cards')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate cards using AI' })
  async generateCards(
    @Body()
    body: {
      topic: string;
      count?: number;
      type?: 'flashcard' | 'multiple_choice' | 'true_false';
      difficulty?: 'easy' | 'medium' | 'hard';
    },
  ) {
    const result = await this.aiService.generateCards(body);
    return { success: true, data: result };
  }

  @Get('explain/:cardId')
  @ApiOperation({ summary: 'Get AI explanation for a card' })
  async explainCard(@Param('cardId') cardId: string) {
    const result = await this.aiService.explainCard(cardId);
    return { success: true, data: result };
  }

  @Post('study-plan')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate personalized study plan' })
  async generateStudyPlan(
    @Body()
    body: {
      topic: string;
      duration?: number;
      dailyGoal?: number;
    },
  ) {
    const result = await this.aiService.generateStudyPlan(body);
    return { success: true, data: result };
  }

  @Get('suggestions/:studySetId')
  @ApiOperation({ summary: 'Get improvement suggestions for study set' })
  async suggestImprovements(@Param('studySetId') studySetId: string) {
    const result = await this.aiService.suggestImprovements(studySetId);
    return { success: true, data: result };
  }

  @Post('quiz/:studySetId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate quiz from study set' })
  async generateQuiz(
    @Param('studySetId') studySetId: string,
    @Body() body: { count?: number },
  ) {
    const result = await this.aiService.generateQuiz(studySetId, body.count);
    return { success: true, data: result };
  }
}
