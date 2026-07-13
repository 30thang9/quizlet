/**
 * TypeORM Tag Entity - Infrastructure Layer
 * TypeORM decorators ALLOWED here
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  Index,
} from 'typeorm';
import { StudySetEntity } from '../../../../study-sets/infrastructure/persistence/entities/study-set.entity';

@Entity('tags')
@Index('idx_tags_name', ['name'])
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 7, default: '#6366f1' })
  color: string;

  @Column({ type: 'integer', default: 0, name: 'usage_count' })
  usageCount: number;

  @ManyToMany(() => StudySetEntity, (studySet) => studySet.tags)
  studySets?: StudySetEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
