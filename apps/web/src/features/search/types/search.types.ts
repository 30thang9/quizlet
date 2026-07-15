// Search Types

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
  user: {
    name: string;
    username: string;
  };
  tags?: { name: string; color: string }[];
  visibility: string;
}

export interface SearchResponse {
  studySets: SearchResult[];
  users?: UserSearchResult[];
  total: number;
}

export interface UserSearchResult {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  studySetCount: number;
}

export interface SearchFilters {
  sortBy?: 'popular' | 'recent' | 'alphabetical';
  visibility?: 'public' | 'private' | 'all';
  cardCount?: { min?: number; max?: number };
}

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
  filters?: SearchFilters;
}

export type SearchBarVariant = 'header' | 'page';

export interface SearchBarProps {
  variant?: SearchBarVariant;
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}
