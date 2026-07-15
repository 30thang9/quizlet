// Study Sets Types
// Re-export from study feature for display components
export type {
  StudySet,
  Card,
  Tag,
  Visibility,
} from '@/features/study/types';

export interface StudySetCardProps {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
  visibility: 'public' | 'private' | 'link';
  likeCount?: number;
  copyCount?: number;
  createdAt: string;
  user?: {
    name: string;
    avatarUrl?: string;
  };
  tags?: { name: string; color: string }[];
  onEdit?: () => void;
  onDelete?: () => void;
  onLike?: () => void;
  onCopy?: () => void;
}

export interface StudySetGridProps {
  studySets: Omit<StudySetCardProps, 'onEdit' | 'onDelete' | 'onLike' | 'onCopy'>[];
  viewMode?: 'grid' | 'list';
}

export interface CardData {
  id: string;
  term: string;
  definition: string;
  hint?: string;
}

export interface CardEditorProps {
  cards: CardData[];
  onChange: (cards: CardData[]) => void;
  readOnly?: boolean;
}
