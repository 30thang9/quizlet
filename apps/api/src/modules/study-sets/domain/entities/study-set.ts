/**
 * Domain StudySet Entity - Pure TypeScript
 * NO TypeORM imports, NO NestJS imports
 * Business logic lives here
 */

export type Visibility = 'public' | 'private' | 'password' | 'link';

export interface StudySetProps {
  userId: string;
  title: string;
  description?: string;
  visibility: Visibility;
  passwordHash?: string;
  language?: string;
  subject?: string;
  cardCount: number;
  viewCount: number;
  likeCount: number;
  copyCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class StudySet {
  private readonly _id: string;
  private props: StudySetProps;

  constructor(id: string, props: StudySetProps) {
    this._id = id;
    this.props = props;
  }

  static create(props: Omit<StudySetProps, 'cardCount' | 'viewCount' | 'likeCount' | 'copyCount' | 'createdAt' | 'updatedAt'>): StudySet {
    return new StudySet(crypto.randomUUID(), {
      ...props,
      cardCount: 0,
      viewCount: 0,
      likeCount: 0,
      copyCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromExisting(id: string, props: StudySetProps): StudySet {
    return new StudySet(id, props);
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get visibility(): Visibility {
    return this.props.visibility;
  }

  get language(): string | undefined {
    return this.props.language;
  }

  get subject(): string | undefined {
    return this.props.subject;
  }

  get cardCount(): number {
    return this.props.cardCount;
  }

  get viewCount(): number {
    return this.props.viewCount;
  }

  get likeCount(): number {
    return this.props.likeCount;
  }

  get copyCount(): number {
    return this.props.copyCount;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isDeleted(): boolean {
    return this.props.deletedAt !== undefined;
  }

  isPublic(): boolean {
    return this.props.visibility === 'public';
  }

  isPrivate(): boolean {
    return this.props.visibility === 'private';
  }

  isPasswordProtected(): boolean {
    return this.props.visibility === 'password';
  }

  hasPassword(): boolean {
    return this.props.passwordHash !== undefined;
  }

  updateTitle(title: string): void {
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  updateDescription(description: string | undefined): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  updateVisibility(visibility: Visibility): void {
    this.props.visibility = visibility;
    this.props.updatedAt = new Date();
  }

  setPassword(passwordHash: string | undefined): void {
    this.props.passwordHash = passwordHash;
    this.props.updatedAt = new Date();
  }

  incrementCardCount(): void {
    this.props.cardCount++;
    this.props.updatedAt = new Date();
  }

  decrementCardCount(): void {
    if (this.props.cardCount > 0) {
      this.props.cardCount--;
      this.props.updatedAt = new Date();
    }
  }

  incrementViewCount(): void {
    this.props.viewCount++;
    this.props.updatedAt = new Date();
  }

  incrementLikeCount(): void {
    this.props.likeCount++;
    this.props.updatedAt = new Date();
  }

  decrementLikeCount(): void {
    if (this.props.likeCount > 0) {
      this.props.likeCount--;
      this.props.updatedAt = new Date();
    }
  }

  incrementCopyCount(): void {
    this.props.copyCount++;
    this.props.updatedAt = new Date();
  }

  softDelete(): void {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  restore(): void {
    this.props.deletedAt = undefined;
    this.props.updatedAt = new Date();
  }

  get propsCopy(): StudySetProps {
    return { ...this.props };
  }
}
