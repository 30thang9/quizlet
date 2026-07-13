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
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a comment' })
  async create(@Request() req: any, @Body() dto: CreateCommentDto) {
    const comment = await this.commentsService.create(req.user.id, dto);
    return { success: true, data: comment };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  async findOne(@Param('id') id: string) {
    const comment = await this.commentsService.findById(id);
    return { success: true, data: comment };
  }

  @Get('study-set/:studySetId')
  @ApiOperation({ summary: 'Get comments for study set' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByStudySet(
    @Param('studySetId') studySetId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.commentsService.findByStudySet(
      studySetId,
      Number(page),
      Number(limit),
    );
    return {
      success: true,
      data: {
        comments: result.comments,
        total: result.total,
        page: Number(page),
        totalPages: Math.ceil(result.total / Number(limit)),
      },
    };
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get replies to a comment' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findReplies(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.commentsService.findReplies(
      id,
      Number(page),
      Number(limit),
    );
    return {
      success: true,
      data: {
        comments: result.comments,
        total: result.total,
        page: Number(page),
        totalPages: Math.ceil(result.total / Number(limit)),
      },
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update comment' })
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateCommentDto,
  ) {
    const comment = await this.commentsService.update(id, req.user.id, dto);
    return { success: true, data: comment };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete comment' })
  async delete(@Param('id') id: string, @Request() req: any) {
    await this.commentsService.delete(id, req.user.id);
    return { success: true, message: 'Comment deleted successfully' };
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on comment' })
  async toggleLike(@Param('id') id: string, @Request() req: any) {
    const result = await this.commentsService.toggleLike(id, req.user.id);
    return { success: true, data: result };
  }
}
