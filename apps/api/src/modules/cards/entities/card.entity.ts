import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('cards')
@Index('idx_cards_study_set', ['studySetId'])
@Index('idx_cards_position', ['studySetId', 'position'])
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'study_set_id' })
  studySetId: string;

  @Column({ type: 'text' })
  term: string;

  @Column({ type: 'text' })
  definition: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'image_url' })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'audio_url' })
  audioUrl?: string;

  @Column({ type: 'integer', default: 0 })
  position: number;

  @Column({ type: 'boolean', default: false, name: 'is_starred' })
  isStarred: boolean;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  isDue(): boolean {
    if (!this.nextReviewAt) return true;
    return new Date() >= this.nextReviewAt;
  }

  updateSpacedRepetition(quality: number): void {
    // SM-2 algorithm simplified
    if (quality >= 3) {
      this.repetitions++;
      if (this.repetitions === 1) {
        this.intervalDays = 1;
      } else if (this.repetitions === 2) {
        this.intervalDays = 6;
      } else {
        this.intervalDays = Math.round(this.intervalDays * this.easeFactor);
      }
    } else {
      this.repetitions = 0;
      this.intervalDays = 1;
    }

    this.easeFactor = Math.max(
      1.3,
      this.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );

    this.memoryScore = (this.memoryScore * 0.8 + quality * 20) / 1.8;
    this.nextReviewAt = new Date(Date.now() + this.intervalDays * 24 * 60 * 60 * 1000);
    this.lastReviewedAt = new Date();
  }
}
