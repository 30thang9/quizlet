import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StudySetsService } from '../../application/study-sets.service';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateStudySetDto } from '../dto/create-study-set.dto';
import { UpdateStudySetDto } from '../dto/update-study-set.dto';
import { CreateCardDto, CreateCardsDto, UpdateCardDto } from '../dto/card.dto';

@ApiTags('Study Sets')
@Controller('study-sets')
export class StudySetsController {
  constructor(private readonly studySetsService: StudySetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get public study sets' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getPublicSets(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    let sets;
    if (search) {
      sets = await this.studySetsService.search(search, page, limit);
    } else {
      sets = await this.studySetsService.findPublic(page, limit);
    }
    return {
      success: true,
      data: sets,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get study set by ID' })
  async getStudySet(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id;
    const studySet = await this.studySetsService.findByIdWithAccessCheck(id, userId);
    return {
      success: true,
      data: studySet,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new study set' })
  async createStudySet(@Body() dto: CreateStudySetDto, @Request() req: any) {
    const studySet = await this.studySetsService.create({
      ...dto,
      userId: req.user.id,
    });
    return {
      success: true,
      data: studySet,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a study set' })
  async updateStudySet(
    @Param('id') id: string,
    @Body() dto: UpdateStudySetDto,
    @Request() req: any,
  ) {
    const studySet = await this.studySetsService.update(id, req.user.id, dto);
    return {
      success: true,
      data: studySet,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a study set' })
  async deleteStudySet(@Param('id') id: string, @Request() req: any) {
    await this.studySetsService.delete(id, req.user.id);
    return {
      success: true,
      message: 'Study set deleted successfully',
    };
  }

  @Get(':id/cards')
  @ApiOperation({ summary: 'Get cards in a study set' })
  async getCards(@Param('id') id: string) {
    const cards = await this.studySetsService.getCards(id);
    return {
      success: true,
      data: cards,
    };
  }

  @Post(':id/cards')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a card to a study set' })
  async createCard(@Param('id') id: string, @Body() dto: CreateCardDto, @Request() req: any) {
    const card = await this.studySetsService.createCard({
      ...dto,
      studySetId: id,
    });
    return {
      success: true,
      data: card,
    };
  }

  @Post(':id/cards/bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add multiple cards to a study set' })
  async createCards(@Param('id') id: string, @Body() dto: CreateCardsDto, @Request() req: any) {
    const cards = await this.studySetsService.createCards(id, dto.cards);
    return {
      success: true,
      data: cards,
    };
  }

  @Patch(':id/cards/:cardId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a card' })
  async updateCard(
    @Param('id') id: string,
    @Param('cardId') cardId: string,
    @Body() dto: UpdateCardDto,
    @Request() req: any,
  ) {
    const card = await this.studySetsService.updateCard(cardId, req.user.id, dto);
    return {
      success: true,
      data: card,
    };
  }

  @Delete(':id/cards/:cardId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a card' })
  async deleteCard(
    @Param('id') id: string,
    @Param('cardId') cardId: string,
    @Request() req: any,
  ) {
    await this.studySetsService.deleteCard(cardId, req.user.id);
    return {
      success: true,
      message: 'Card deleted successfully',
    };
  }
}
