/**
 * TypeORM StudySet Entity - Infrastructure Layer
 * TypeORM decorators ALLOWED here
 * NO business logic
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { UserEntity } from '../../../../users/infrastructure/persistence/entities/user.entity';
import { TagEntity } from '../../../../tags/infrastructure/persistence/entities/tag.entity';

export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PASSWORD = 'password',
  LINK = 'link',
}

@Entity('study_sets')
@Index('idx_study_sets_user', ['userId'])
@Index('idx_study_sets_visibility', ['visibility'])
@Index('idx_study_sets_subject', ['subject'])
@Index('idx_study_sets_created', ['createdAt'])
export class StudySetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_hash' })
  passwordHash?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subject?: string;

  @ManyToMany(() => TagEntity, (tag) => tag.studySets, { cascade: true })
  @JoinTable({
    name: 'study_set_tags',
    joinColumn: { name: 'study_set_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags?: TagEntity[];

  @Column({ type: 'integer', default: 0, name: 'card_count' })
  cardCount: number;

  @Column({ type: 'integer', default: 0, name: 'view_count' })
  viewCount: number;

  @Column({ type: 'integer', default: 0, name: 'like_count' })
  likeCount: number;

  @Column({ type: 'integer', default: 0, name: 'copy_count' })
  copyCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;
}
