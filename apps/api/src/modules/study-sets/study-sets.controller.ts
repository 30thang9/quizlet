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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { StudySetsService } from './study-sets.service';
import { CreateStudySetDto, UpdateStudySetDto, CreateCardDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StudySetVisibility } from './entities/study-set.entity';

@ApiTags('Study Sets')
@Controller('study-sets')
export class StudySetsController {
  constructor(private readonly studySetsService: StudySetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new study set' })
  async create(@Request() req: any, @Body() dto: CreateStudySetDto) {
    const studySet = await this.studySetsService.create(req.user.id, dto);
    return {
      success: true,
      data: studySet,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List public study sets' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'visibility', required: false, enum: StudySetVisibility })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('visibility') visibility?: StudySetVisibility,
  ) {
    const result = await this.studySetsService.findAll(
      undefined,
      Number(page),
      Number(limit),
      visibility,
    );

    return {
      success: true,
      data: {
        studySets: result.studySets,
        total: result.total,
        page: Number(page),
        totalPages: Math.ceil(result.total / Number(limit)),
      },
    };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user study sets' })
  async getMyStudySets(
    @Request() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.studySetsService.findAll(
      req.user.id,
      Number(page),
      Number(limit),
    );

    return {
      success: true,
      data: {
        studySets: result.studySets,
        total: result.total,
        page: Number(page),
        totalPages: Math.ceil(result.total / Number(limit)),
      },
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search study sets' })
  @ApiQuery({ name: 'q', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.studySetsService.search(
      query,
      Number(page),
      Number(limit),
    );

    return {
      success: true,
      data: {
        studySets: result.studySets,
        total: result.total,
        page: Number(page),
        totalPages: Math.ceil(result.total / Number(limit)),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get study set by ID' })
  async findOne(@Param('id') id: string, @Request() req?: any) {
    const userId = req?.user?.id;
    const studySet = await this.studySetsService.findById(id, userId);
    return {
      success: true,
      data: studySet,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update study set' })
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateStudySetDto,
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
  @ApiOperation({ summary: 'Delete study set' })
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.studySetsService.delete(id, req.user.id);
    return { success: true, message: 'Study set deleted successfully' };
  }

  // Cards endpoints
  @Get(':id/cards')
  @ApiOperation({ summary: 'Get study set cards' })
  async getCards(@Param('id') id: string, @Request() req?: any) {
    const userId = req?.user?.id;
    const cards = await this.studySetsService.getCards(id, userId);
    return {
      success: true,
      data: cards,
    };
  }

  @Post(':id/cards')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add card to study set' })
  async addCard(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: CreateCardDto,
  ) {
    const card = await this.studySetsService.addCard(id, req.user.id, dto);
    return {
      success: true,
      data: card,
    };
  }

  @Patch(':id/cards/:cardId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update card' })
  async updateCard(
    @Param('id') id: string,
    @Param('cardId') cardId: string,
    @Request() req: any,
    @Body() dto: Partial<CreateCardDto>,
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
  @ApiOperation({ summary: 'Delete card' })
  async deleteCard(
    @Param('id') id: string,
    @Param('cardId') cardId: string,
    @Request() req: any,
  ) {
    await this.studySetsService.deleteCard(cardId, req.user.id);
    return { success: true, message: 'Card deleted successfully' };
  }
}
