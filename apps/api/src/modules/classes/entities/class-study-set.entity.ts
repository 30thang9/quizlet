import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Class } from './class.entity';
import { StudySet } from '../../study-sets/entities/study-set.entity';

@Entity('class_study_sets')
@Unique(['classId', 'studySetId'])
@Index(['classId'])
export class ClassStudySet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id' })
  classId: string;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ name: 'study_set_id' })
  studySetId: string;

  @ManyToOne(() => StudySet)
  @JoinColumn({ name: 'study_set_id' })
  studySet: StudySet;

  @Column({ nullable: true, name: 'assigned_by' })
  assignedBy?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'due_date' })
  dueDate?: Date;

  @Column({ type: 'boolean', default: false, name: 'is_completed' })
  isCompleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
