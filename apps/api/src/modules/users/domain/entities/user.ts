/**
 * Domain User Entity - Pure TypeScript
 * NO TypeORM imports, NO NestJS imports
 * Business logic lives here
 */

// Types
export type UserRole = 'free' | 'plus' | 'unlimited' | 'teacher';

export interface UserProps {
  email: string;
  passwordHash: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  emailVerifiedAt?: Date;
  isActive: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Domain User Entity
 * Pure TypeScript class with business logic
 */
export class User {
  private readonly _id: string;
  private props: UserProps;

  constructor(id: string, props: UserProps) {
    this._id = id;
    this.props = props;
  }

  // Factory methods
  static create(props: UserProps): User {
    return new User(crypto.randomUUID(), {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromExisting(id: string, props: UserProps): User {
    return new User(id, props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isEmailVerified(): boolean {
    return this.props.emailVerifiedAt !== undefined;
  }

  get failedLoginAttempts(): number {
    return this.props.failedLoginAttempts;
  }

  get lockedUntil(): Date | undefined {
    return this.props.lockedUntil;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business logic
  isTeacher(): boolean {
    return this.props.role === 'teacher';
  }

  isPremium(): boolean {
    return ['plus', 'unlimited', 'teacher'].includes(this.props.role);
  }

  isLocked(): boolean {
    if (!this.props.lockedUntil) return false;
    return this.props.lockedUntil > new Date();
  }

  canAttemptLogin(): boolean {
    if (!this.isLocked()) return true;
    return this.props.lockedUntil! <= new Date();
  }

  recordFailedLogin(): void {
    this.props.failedLoginAttempts += 1;
    if (this.props.failedLoginAttempts >= 5) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + 15);
      this.props.lockedUntil = lockUntil;
    }
    this.props.updatedAt = new Date();
  }

  resetFailedLogins(): void {
    this.props.failedLoginAttempts = 0;
    this.props.lockedUntil = undefined;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  updateProfile(data: { name?: string; avatarUrl?: string; bio?: string }): void {
    if (data.name !== undefined) this.props.name = data.name;
    if (data.avatarUrl !== undefined) this.props.avatarUrl = data.avatarUrl;
    if (data.bio !== undefined) this.props.bio = data.bio;
    this.props.updatedAt = new Date();
  }

  upgrade(role: UserRole): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  verifyEmail(): void {
    this.props.emailVerifiedAt = new Date();
    this.props.updatedAt = new Date();
  }

  // For mapper access
  get propsCopy(): UserProps {
    return { ...this.props };
  }
}
