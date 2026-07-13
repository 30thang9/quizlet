import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './application/comments.service';
import { CommentsController, CommentActionsController } from './presentation/controllers/comments.controller';
import { Comment } from './domain/entities/comment.entity';
import { CommentLike } from './domain/entities/comment-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentLike])],
  controllers: [CommentsController, CommentActionsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
