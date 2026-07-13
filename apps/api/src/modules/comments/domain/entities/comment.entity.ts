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
import { User } from '../../../users/domain/entities/user.entity';
import { StudySet } from '../../../study-sets/domain/entities/study-set.entity';

@Entity('comments')
@Index('idx_comments_study_set', ['studySetId'])
@Index('idx_comments_user', ['userId'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'study_set_id' })
  studySetId: string;

  @ManyToOne(() => StudySet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'study_set_id' })
  studySet?: StudySet;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'integer', default: 0, name: 'like_count' })
  likeCount: number;

  @Column({ type: 'boolean', default: false, name: 'is_edited' })
  isEdited: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;
}
