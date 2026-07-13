import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { ReviewCardDto } from './dto';
import { StudyMode } from './entities/study-session.entity';

@ApiTags('Progress')
@Controller('progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new study session' })
  async createSession(
    @Request() req: any,
    @Body() body: { studySetId?: string; mode?: StudyMode },
  ) {
    const session = await this.progressService.createSession(
      req.user.id,
      body.studySetId,
      body.mode,
    );
    return { success: true, data: session };
  }

  @Patch('sessions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End a study session' })
  async endSession(
    @Request() req: any,
    @Param('id') sessionId: string,
    @Body()
    body: {
      cardsStudied: number;
      correctCount: number;
      timeSpentSeconds: number;
      mistakes: number;
      score?: number;
    },
  ) {
    const session = await this.progressService.endSession(sessionId, req.user.id, body);
    return { success: true, data: session };
  }

  @Post('review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Review a card (SM-2 algorithm)' })
  async reviewCard(@Request() req: any, @Body() dto: ReviewCardDto) {
    const progress = await this.progressService.reviewCard(req.user.id, dto);
    return { success: true, data: progress };
  }

  @Get('cards/:cardId')
  @ApiOperation({ summary: 'Get progress for a specific card' })
  async getCardProgress(@Request() req: any, @Param('cardId') cardId: string) {
    const progress = await this.progressService.getCardProgress(req.user.id, cardId);
    return { success: true, data: progress };
  }

  @Get('due')
  @ApiOperation({ summary: 'Get due cards for review' })
  @ApiQuery({ name: 'studySetId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getDueCards(
    @Request() req: any,
    @Query('studySetId') studySetId?: string,
    @Query('limit') limit?: string,
  ) {
    const dueCards = await this.progressService.getDueCards(
      req.user.id,
      studySetId,
      limit ? parseInt(limit, 10) : 50,
    );
    return { success: true, data: dueCards };
  }

  @Get('study-sets/:studySetId')
  @ApiOperation({ summary: 'Get progress summary for a study set' })
  async getStudySetProgress(@Request() req: any, @Param('studySetId') studySetId: string) {
    const stats = await this.progressService.getStudySetProgress(req.user.id, studySetId);
    return { success: true, data: stats };
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get study session history' })
  @ApiQuery({ name: 'studySetId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getSessionHistory(
    @Request() req: any,
    @Query('studySetId') studySetId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.progressService.getSessionHistory(
      req.user.id,
      studySetId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, data: result };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get overall study statistics' })
  async getStudyStats(@Request() req: any) {
    const stats = await this.progressService.getStudyStats(req.user.id);
    return { success: true, data: stats };
  }
}
