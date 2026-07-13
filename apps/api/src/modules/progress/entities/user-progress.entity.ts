import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../study-sets/entities/card.entity';

@Entity('user_progress')
@Index(['userId', 'cardId'], { unique: true })
@Index(['userId'])
@Index(['cardId'])
@Index(['nextReviewAt'])
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'card_id' })
  cardId: string;

  @ManyToOne(() => Card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'memory_score' })
  memoryScore: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 2.5, name: 'ease_factor' })
  easeFactor: number;

  @Column({ type: 'integer', default: 0, name: 'interval_days' })
  intervalDays: number;

  @Column({ type: 'integer', default: 0 })
  repetitions: number;

  @Column({ type: 'timestamp', nullable: true, name: 'next_review_at' })
  nextReviewAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'last_reviewed_at' })
  lastReviewedAt?: Date;

  @CreateDateColumn({ name: 'reviewed_at' })
  reviewedAt: Date;

  @Column({ nullable: true, name: 'study_session_id' })
  studySessionId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
