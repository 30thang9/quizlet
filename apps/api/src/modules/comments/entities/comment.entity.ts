import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum CommentableType {
  STUDY_SET = 'study_set',
  CARD = 'card',
  CLASS = 'class',
}

@Entity('comments')
@Index(['userId'])
@Index(['studySetId'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: string;

  @ManyToOne(() => Comment, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent?: Comment;

  @Column({ type: 'enum', enum: CommentableType })
  type: CommentableType;

  @Column({ name: 'study_set_id', nullable: true })
  studySetId?: string;

  @Column({ name: 'card_id', nullable: true })
  cardId?: string;

  @Column({ name: 'class_id', nullable: true })
  classId?: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false, name: 'is_edited' })
  isEdited: boolean;

  @Column({ type: 'integer', default: 0, name: 'likes_count' })
  likesCount: number;

  @Column({ type: 'integer', default: 0, name: 'replies_count' })
  repliesCount: number;

  @Column({ type: 'boolean', default: true, name: 'is_visible' })
  isVisible: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  isReply(): boolean {
    return !!this.parentId;
  }

  incrementLikes(): void {
    this.likesCount++;
  }

  decrementLikes(): void {
    if (this.likesCount > 0) this.likesCount--;
  }

  incrementReplies(): void {
    this.repliesCount++;
  }

  decrementReplies(): void {
    if (this.repliesCount > 0) this.repliesCount--;
  }
}
