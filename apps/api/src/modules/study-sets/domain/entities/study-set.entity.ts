import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/domain/entities/user.entity';

export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PASSWORD = 'password',
  LINK = 'link',
}

@Entity('study_sets')
@Index('idx_study_sets_user', ['userId'])
@Index('idx_study_sets_visibility', ['visibility'])
@Index('idx_study_sets_subject', ['subject'])
@Index('idx_study_sets_created', ['createdAt'])
export class StudySet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subject: string;

  // Denormalized stats
  @Column({ type: 'integer', default: 0, name: 'card_count' })
  cardCount: number;

  @Column({ type: 'integer', default: 0, name: 'view_count' })
  viewCount: number;

  @Column({ type: 'integer', default: 0, name: 'like_count' })
  likeCount: number;

  @Column({ type: 'integer', default: 0, name: 'copy_count' })
  copyCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  // Helper methods
  isPublic(): boolean {
    return this.visibility === Visibility.PUBLIC;
  }

  incrementViewCount(): void {
    this.viewCount++;
  }

  incrementLikeCount(): void {
    this.likeCount++;
  }

  decrementLikeCount(): void {
    if (this.likeCount > 0) this.likeCount--;
  }
}
