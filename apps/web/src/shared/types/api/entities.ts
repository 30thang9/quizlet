/**
 * Entity Types - matches backend entities
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySet {
  id: string;
  title: string;
  description?: string;
  visibility: Visibility;
  language?: string;
  subject?: string;
  cardCount: number;
  viewCount: number;
  likeCount: number;
  copyCount: number;
  userId: string;
  user?: User;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CLASS = 'class',
}

export interface Card {
  id: string;
  studySetId: string;
  term: string;
  definition: string;
  imageUrl?: string;
  audioUrl?: string;
  position: number;
  isStarred: boolean;
  memoryScore: number;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
}

export interface Comment {
  id: string;
  userId: string;
  studySetId: string;
  content: string;
  likeCount: number;
  isEdited: boolean;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ClassEntity {
  id: string;
  name: string;
  subject?: string;
  gradeLevel?: string;
  description?: string;
  enrollmentCode: string;
  teacherId: string;
  teacher?: User;
  requireLogin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  classId: string;
  studySetId: string;
  title?: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  studyMode: string;
  requireCompletion: boolean;
  minScore?: number;
  attemptsAllowed: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudySetVersion {
  id: string;
  studySetId: string;
  userId: string;
  action: VersionAction;
  title?: string;
  description?: string;
  cardsSnapshot: CardSnapshot[];
  cardCount: number;
  changeSummary?: string;
  isCurrent: boolean;
  user?: User;
  createdAt: string;
}

export type VersionAction =
  | 'created'
  | 'updated'
  | 'restored'
  | 'card_added'
  | 'card_edited'
  | 'card_deleted';

export interface CardSnapshot {
  id: string;
  term: string;
  definition: string;
}
