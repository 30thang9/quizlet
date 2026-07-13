import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum StudySetVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  SHARED = 'shared',
}

@Entity('study_sets')
@Index(['userId'])
@Index(['visibility'])
@Index(['isPublished'])
export class StudySet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: StudySetVisibility, default: StudySetVisibility.PRIVATE })
  visibility: StudySetVisibility;

  @Column({ type: 'boolean', default: false, name: 'is_published' })
  isPublished: boolean;

  @Column({ type: 'integer', default: 0 })
  likes: number;

  @Column({ type: 'integer', default: 0 })
  views: number;

  @Column({ type: 'integer', default: 0, name: 'cards_count' })
  cardsCount: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'thumbnail_url' })
  thumbnailUrl?: string;

  @Column({ type: 'jsonb', nullable: true, name: 'study_settings' })
  studySettings?: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true, name: 'last_studied_at' })
  lastStudiedAt?: Date;

  @Column({ type: 'integer', default: 0, name: 'study_sessions_count' })
  studySessionsCount: number;

  @Column({ type: 'integer', default: 0, name: 'perfect_count' })
  perfectCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  isPublic(): boolean {
    return this.visibility === StudySetVisibility.PUBLIC;
  }

  isOwner(userId: string): boolean {
    return this.userId === userId;
  }

  incrementViews(): void {
    this.views++;
  }

  updateCardsCount(count: number): void {
    this.cardsCount = count;
  }
}
