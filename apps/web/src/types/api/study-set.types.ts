/**
 * Study Set API Types
 */

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

export interface CreateStudySetRequest {
  title: string;
  description?: string;
  visibility?: 'public' | 'private' | 'link';
  folderId?: string;
}

export interface UpdateStudySetRequest {
  title?: string;
  description?: string;
  visibility?: 'public' | 'private' | 'link';
  folderId?: string;
}

export interface CreateCardRequest {
  term: string;
  definition: string;
  hint?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface UpdateCardRequest {
  term?: string;
  definition?: string;
  hint?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface CreateFolderRequest {
  name: string;
  color?: string;
  parentId?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  color?: string;
  parentId?: string;
}

export interface StudySetListParams {
  page?: number;
  limit?: number;
  userId?: string;
  folderId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

export interface StudySetListResponse {
  data: StudySet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
