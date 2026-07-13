import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../../users/domain/entities/user.entity';
import { StudySet } from '../../../study-sets/domain/entities/study-set.entity';

export enum VersionAction {
  CREATED = 'created',
  UPDATED = 'updated',
  RESTORED = 'restored',
  CARD_ADDED = 'card_added',
  CARD_EDITED = 'card_edited',
  CARD_DELETED = 'card_deleted',
}

export interface CardSnapshot {
  id: string;
  term: string;
  definition: string;
}

@Entity('study_set_versions')
@Index('idx_versions_study_set', ['studySetId'])
@Index('idx_versions_created', ['createdAt'])
export class StudySetVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'study_set_id' })
  studySetId: string;

  @ManyToOne(() => StudySet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'study_set_id' })
  studySet?: StudySet;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({
    type: 'enum',
    enum: VersionAction,
    default: VersionAction.UPDATED,
  })
  action: VersionAction;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb' })
  cardsSnapshot: CardSnapshot[];

  @Column({ type: 'integer', name: 'card_count' })
  cardCount: number;

  @Column({ type: 'text', nullable: true, name: 'change_summary' })
  changeSummary?: string;

  @Column({ type: 'boolean', default: false, name: 'is_current' })
  isCurrent: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
