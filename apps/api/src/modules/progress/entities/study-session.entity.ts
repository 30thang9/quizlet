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
import { StudySet } from '../../study-sets/entities/study-set.entity';

export enum StudyMode {
  FLASHCARD = 'flashcard',
  LEARN = 'learn',
  TEST = 'test',
  MATCH = 'match',
}

@Entity('study_sessions')
@Index(['userId'])
@Index(['startedAt'])
export class StudySession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, name: 'study_set_id' })
  studySetId?: string;

  @ManyToOne(() => StudySet, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'study_set_id' })
  studySet?: StudySet;

  @Column({
    type: 'enum',
    enum: StudyMode,
    default: StudyMode.FLASHCARD,
  })
  mode: StudyMode;

  @Column({ type: 'integer', default: 0, name: 'cards_studied' })
  cardsStudied: number;

  @Column({ type: 'integer', default: 0, name: 'correct_count' })
  correctCount: number;

  @Column({ type: 'integer', default: 0, name: 'time_spent_seconds' })
  timeSpentSeconds: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score?: number;

  @Column({ type: 'integer', default: 0 })
  mistakes: number;

  @CreateDateColumn({ name: 'started_at' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'ended_at' })
  endedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
