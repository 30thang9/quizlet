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
import { User } from '../../users/entities/user.entity';

export enum DiagramType {
  FLOWCHART = 'flowchart',
  MINDMAP = 'mindmap',
  TIMELINE = 'timeline',
  HIERARCHY = 'hierarchy',
}

@Entity('diagrams')
@Index(['userId'])
@Index(['studySetId'])
export class Diagram {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'study_set_id', nullable: true })
  studySetId?: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: DiagramType, default: DiagramType.FLOWCHART })
  type: DiagramType;

  @Column({ type: 'jsonb', default: {} })
  data: Record<string, any>;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl?: string;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'views_count', type: 'integer', default: 0 })
  viewsCount: number;

  @Column({ name: 'likes_count', type: 'integer', default: 0 })
  likesCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
