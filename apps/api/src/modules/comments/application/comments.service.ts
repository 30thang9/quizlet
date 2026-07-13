import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from '../domain/entities/comment.entity';
import { CommentLike } from '../domain/entities/comment-like.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  async findByStudySet(
    studySetId: string,
    page = 1,
    limit = 20,
  ): Promise<{ comments: Comment[]; total: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: {
        studySetId,
        deletedAt: IsNull(),
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { comments, total };
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async create(
    userId: string,
    studySetId: string,
    content: string,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      userId,
      studySetId,
      content,
    });

    return this.commentRepository.save(comment);
  }

  async update(id: string, userId: string, content: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new NotFoundException('Comment not found');
    }

    comment.content = content;
    comment.isEdited = true;

    return this.commentRepository.save(comment);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new NotFoundException('Comment not found');
    }

    comment.deletedAt = new Date();
    await this.commentRepository.save(comment);

    return true;
  }

  async toggleLike(commentId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    const existingLike = await this.commentLikeRepository.findOne({
      where: { commentId, userId },
    });

    const comment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (existingLike) {
      await this.commentLikeRepository.delete({ commentId, userId });
      comment.likeCount = Math.max(0, comment.likeCount - 1);
      await this.commentRepository.save(comment);
      return { liked: false, likeCount: comment.likeCount };
    } else {
      const like = this.commentLikeRepository.create({ commentId, userId });
      await this.commentLikeRepository.save(like);
      comment.likeCount++;
      await this.commentRepository.save(comment);
      return { liked: true, likeCount: comment.likeCount };
    }
  }

  async isLikedByUser(commentId: string, userId: string): Promise<boolean> {
    const like = await this.commentLikeRepository.findOne({
      where: { commentId, userId },
    });
    return !!like;
  }
}
