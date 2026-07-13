import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export enum UserRole {
  FREE = 'free',
  PLUS = 'plus',
  UNLIMITED = 'unlimited',
  TEACHER = 'teacher',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
@Index(['isActive'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.FREE,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ nullable: true, type: 'timestamptz' })
  lockedUntil: Date | null;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  lastLoginIp: string;

  @Column({ nullable: true, name: 'reset_token' })
  resetToken?: string;

  @Column({ nullable: true, type: 'timestamptz', name: 'reset_token_expires_at' })
  resetTokenExpiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  sanitizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  isLocked(): boolean {
    if (!this.lockedUntil) return false;
    return this.lockedUntil > new Date();
  }

  isTeacher(): boolean {
    return this.role === UserRole.TEACHER;
  }

  isPlusOrUnlimited(): boolean {
    return this.role === UserRole.PLUS || this.role === UserRole.UNLIMITED;
  }

  incrementFailedLogin(): void {
    this.failedLoginAttempts++;
    if (this.failedLoginAttempts >= 5) {
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }
  }

  resetFailedLogin(): void {
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
  }
}
