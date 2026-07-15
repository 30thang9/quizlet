// Classes Types

export interface Class {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  memberCount: number;
  studySetCount: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  members?: ClassMember[];
}

export interface ClassMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface ClassStudySet {
  id: string;
  title: string;
  cardCount: number;
  addedAt: string;
  studySet?: {
    id: string;
    title: string;
    visibility: string;
  };
}
