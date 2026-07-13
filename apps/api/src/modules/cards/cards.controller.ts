import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto, ReviewCardDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cards')
@Controller('cards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get card by ID' })
  async findOne(@Param('id') id: string) {
    const card = await this.cardsService.findById(id);
    return { success: true, data: card };
  }

  @Get('study-set/:studySetId')
  @ApiOperation({ summary: 'Get cards by study set' })
  async findByStudySet(@Param('studySetId') studySetId: string) {
    const cards = await this.cardsService.findByStudySet(studySetId);
    return { success: true, data: cards };
  }

  @Get('study-set/:studySetId/due')
  @ApiOperation({ summary: 'Get due cards for study' })
  async findDueCards(@Param('studySetId') studySetId: string) {
    const cards = await this.cardsService.findDueCards(studySetId);
    return { success: true, data: cards };
  }

  @Post('study-set/:studySetId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create card in study set' })
  async create(
    @Param('studySetId') studySetId: string,
    @Body() dto: CreateCardDto,
  ) {
    const card = await this.cardsService.create(studySetId, dto);
    return { success: true, data: card };
  }

  @Post('study-set/:studySetId/bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create multiple cards' })
  async bulkCreate(
    @Param('studySetId') studySetId: string,
    @Body() dtos: CreateCardDto[],
  ) {
    const cards = await this.cardsService.bulkCreate(studySetId, dtos);
    return { success: true, data: cards };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update card' })
  async update(@Param('id') id: string, @Body() dto: UpdateCardDto) {
    const card = await this.cardsService.update(id, dto);
    return { success: true, data: card };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete card' })
  async delete(@Param('id') id: string) {
    await this.cardsService.delete(id);
    return { success: true, message: 'Card deleted successfully' };
  }

  @Post(':id/review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Review card (spaced repetition)' })
  async review(@Param('id') id: string, @Body() dto: ReviewCardDto) {
    const card = await this.cardsService.review(id, dto);
    return { success: true, data: card };
  }

  @Post(':id/star')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle star on card' })
  async toggleStar(@Param('id') id: string) {
    const card = await this.cardsService.toggleStar(id);
    return { success: true, data: card };
  }

  @Post('study-set/:studySetId/reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reorder cards' })
  async reorder(
    @Param('studySetId') studySetId: string,
    @Body() cardIds: string[],
  ) {
    const cards = await this.cardsService.reorder(studySetId, cardIds);
    return { success: true, data: cards };
  }

  @Get('study-set/:studySetId/stats')
  @ApiOperation({ summary: 'Get card statistics' })
  async getStats(@Param('studySetId') studySetId: string) {
    const stats = await this.cardsService.getStats(studySetId);
    return { success: true, data: stats };
  }
}
