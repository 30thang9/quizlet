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
import { User } from '../../../users/domain/entities/user.entity';

export enum ClassMemberRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
}

@Entity('classes')
@Index('idx_classes_teacher', ['teacherId'])
@Index('idx_classes_enrollment', ['enrollmentCode'])
export class ClassEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subject: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'grade_level' })
  gradeLevel: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 10, unique: true, name: 'enrollment_code' })
  enrollmentCode: string;

  @Column({ type: 'boolean', default: true, name: 'require_login' })
  requireLogin: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  static generateEnrollmentCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

@Entity('class_members')
@Index('idx_class_members_class', ['classId'])
@Index('idx_class_members_user', ['userId'])
export class ClassMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id' })
  classId: string;

  @ManyToOne(() => ClassEntity)
  @JoinColumn({ name: 'class_id' })
  class: ClassEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ClassMemberRole,
    default: ClassMemberRole.STUDENT,
  })
  role: ClassMemberRole;

  @Column({ name: 'joined_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;
}

@Entity('assignments')
@Index('idx_assignments_class', ['classId'])
@Index('idx_assignments_due', ['dueDate'])
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id' })
  classId: string;

  @ManyToOne(() => ClassEntity)
  @JoinColumn({ name: 'class_id' })
  class: ClassEntity;

  @Column({ name: 'study_set_id' })
  studySetId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true, name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'time', nullable: true, name: 'due_time' })
  dueTime: string;

  @Column({ type: 'varchar', length: 50, default: 'learn', name: 'study_mode' })
  studyMode: string;

  @Column({ type: 'boolean', default: true, name: 'require_completion' })
  requireCompletion: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'min_score' })
  minScore: number;

  @Column({ type: 'integer', default: 1, name: 'attempts_allowed' })
  attemptsAllowed: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('assignment_progress')
@Index('idx_assignment_progress_assignment', ['assignmentId'])
@Index('idx_assignment_progress_user', ['userId'])
export class AssignmentProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'assignment_id' })
  assignmentId: string;

  @ManyToOne(() => Assignment)
  @JoinColumn({ name: 'assignment_id' })
  assignment: Assignment;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, default: 'not_started' })
  status: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number;

  @Column({ type: 'integer', nullable: true, name: 'time_spent_seconds' })
  timeSpentSeconds: number;

  @Column({ type: 'integer', default: 0 })
  attempts: number;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
