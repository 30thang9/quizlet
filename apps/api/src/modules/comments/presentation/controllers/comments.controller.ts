import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CommentsService } from '../../application/comments.service';

@Controller('study-sets/:studySetId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findByStudySet(
    @Param('studySetId') studySetId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.commentsService.findByStudySet(
      studySetId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Post()
  async create(
    @Param('studySetId') studySetId: string,
    @Body() body: { userId: string; content: string },
  ) {
    return this.commentsService.create(body.userId, studySetId, body.content);
  }
}

@Controller('comments')
export class CommentActionsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { userId: string; content: string },
  ) {
    return this.commentsService.update(id, body.userId, body.content);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    await this.commentsService.delete(id, body.userId);
    return { success: true };
  }

  @Post(':id/like')
  async toggleLike(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.commentsService.toggleLike(id, body.userId);
  }
}
