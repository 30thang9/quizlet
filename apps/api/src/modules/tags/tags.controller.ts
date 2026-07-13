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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tag' })
  async create(@Body() dto: CreateTagDto) {
    const tag = await this.tagsService.create(dto);
    return { success: true, data: tag };
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('search') search?: string,
  ) {
    const result = await this.tagsService.findAll(
      Number(page),
      Number(limit),
      search,
    );
    return {
      success: true,
      data: {
        tags: result.tags,
        total: result.total,
      },
    };
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular tags' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findPopular(@Query('limit') limit = 20) {
    const tags = await this.tagsService.findPopular(Number(limit));
    return { success: true, data: tags };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by ID' })
  async findOne(@Param('id') id: string) {
    const tag = await this.tagsService.findById(id);
    return { success: true, data: tag };
  }

  @Get(':id/study-sets')
  @ApiOperation({ summary: 'Get study sets with this tag' })
  async getStudySets(@Param('id') id: string) {
    const tag = await this.tagsService.findById(id);
    return { success: true, data: tag };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tag' })
  async update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    const tag = await this.tagsService.update(id, dto);
    return { success: true, data: tag };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete tag' })
  async delete(@Param('id') id: string) {
    await this.tagsService.delete(id);
    return { success: true, message: 'Tag deleted successfully' };
  }
}
