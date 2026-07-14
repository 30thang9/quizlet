import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment-like.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private readonly likeRepository: Repository<CommentLike>,
  ) {}

  async create(userId: string, dto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create({
      userId,
      type: dto.type,
      content: dto.content,
      parentId: dto.parentId,
      studySetId: dto.studySetId,
      cardId: dto.cardId,
      classId: dto.classId,
    });

    const saved = await this.commentRepository.save(comment);

    if (dto.parentId) {
      await this.commentRepository.increment(
        { id: dto.parentId },
        'repliesCount',
        1,
      );
    }

    return this.findById(saved.id);
  }

  async findById(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async findByStudySet(
    studySetId: string,
    page = 1,
    limit = 20,
  ): Promise<{ comments: Comment[]; total: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { studySetId, parentId: undefined },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { comments, total };
  }

  async findReplies(
    parentId: string,
    page = 1,
    limit = 20,
  ): Promise<{ comments: Comment[]; total: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { parentId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { comments, total };
  }

  async update(id: string, userId: string, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findById(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.content = dto.content;
    comment.isEdited = true;

    return this.commentRepository.save(comment);
  }

  async delete(id: string, userId: string): Promise<void> {
    const comment = await this.findById(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    if (comment.parentId) {
      await this.commentRepository.decrement(
        { id: comment.parentId },
        'repliesCount',
        1,
      );
    }

    await this.commentRepository.delete(id);
  }

  async toggleLike(commentId: string, userId: string): Promise<{ liked: boolean }> {
    await this.findById(commentId);

    const existing = await this.likeRepository.findOne({
      where: { commentId, userId },
    });

    if (existing) {
      await this.likeRepository.delete(existing.id);
      await this.commentRepository.decrement({ id: commentId }, 'likesCount', 1);
      return { liked: false };
    }

    await this.likeRepository.save({
      commentId,
      userId,
    });
    await this.commentRepository.increment({ id: commentId }, 'likesCount', 1);

    return { liked: true };
  }

  async isLiked(commentId: string, userId: string): Promise<boolean> {
    const count = await this.likeRepository.count({ where: { commentId, userId } });
    return count > 0;
  }
}
