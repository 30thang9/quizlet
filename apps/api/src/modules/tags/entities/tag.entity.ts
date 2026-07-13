import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('tags')
@Index(['name'], { unique: true })
@Index(['slug'], { unique: true })
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true, name: 'description' })
  description?: string;

  @Column({ name: 'color', default: '#3B82F6', length: 7 })
  color: string;

  @Column({ name: 'icon', nullable: true, length: 50 })
  icon?: string;

  @Column({ name: 'study_sets_count', default: 0, type: 'integer' })
  studySetsCount: number;

  @Column({ name: 'usage_count', default: 0, type: 'integer' })
  usageCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  static toSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
