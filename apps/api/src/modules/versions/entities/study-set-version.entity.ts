import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum VersionAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Entity('study_set_versions')
@Index(['studySetId'])
@Index(['userId'])
export class StudySetVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'study_set_id' })
  studySetId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: VersionAction })
  action: VersionAction;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @Column({ name: 'cards_snapshot', type: 'jsonb', nullable: true })
  cardsSnapshot?: any[];

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'cards_count', type: 'integer', default: 0 })
  cardsCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
