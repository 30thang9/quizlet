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
import { User } from '../../users/entities/user.entity';
import { ClassRole } from './class.entity';

@Entity('class_members')
@Unique(['classId', 'userId'])
@Index(['userId'])
export class ClassMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id' })
  classId: string;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ClassRole, default: ClassRole.STUDENT })
  role: ClassRole;

  @Column({ nullable: true, name: 'nickname' })
  nickname?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'joined_at' })
  joinedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
