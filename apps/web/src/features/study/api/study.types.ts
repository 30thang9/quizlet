/**
 * Study Feature Types
 */

export interface Card {
  id: string;
  term: string;
  definition: string;
  hint?: string;
  imageUrl?: string;
  audioUrl?: string;
  studySetId: string;
  createdAt: string;
  updatedAt: string;
  progress?: CardProgress;
}

export interface CardProgress {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate?: string;
  lastReviewed?: string;
}

export interface StudySet {
  id: string;
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'link';
  userId: string;
  folderId?: string;
  cardCount: number;
  likeCount: number;
  copyCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  cards?: Card[];
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count?: number;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  parentId?: string;
  studySetCount: number;
  createdAt: string;
  updatedAt: string;
  children?: Folder[];
}

export interface StudySession {
  id: string;
  studySetId?: string;
  mode: string;
  startedAt: Date;
  cardsStudied?: number;
  correctCount?: number;
  timeSpentSeconds?: number;
  mistakes?: number;
  score?: number;
}

export interface StudyStats {
  totalCardsStudied: number;
  totalStudyTime: number;
  averageScore: number;
  studyStreak: number;
  cardsLearned: number;
  cardsMastered: number;
  dueCardsCount: number;
}

export type StudyMode = 'learn' | 'flashcards' | 'match' | 'quiz' | 'test';
export type Visibility = 'public' | 'private' | 'link';

