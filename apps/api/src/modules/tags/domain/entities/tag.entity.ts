import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { StudySet } from '../../../study-sets/domain/entities/study-set.entity';

@Entity('tags')
@Index('idx_tags_name', ['name'])
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 7, default: '#6366f1' }) // Hex color
  color: string;

  @Column({ type: 'integer', default: 0, name: 'usage_count' })
  usageCount: number;

  @ManyToMany(() => StudySet, (studySet: StudySet) => studySet.tags)
  studySets?: StudySet[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  incrementUsageCount(): void {
    this.usageCount++;
  }

  decrementUsageCount(): void {
    if (this.usageCount > 0) this.usageCount--;
  }
}
