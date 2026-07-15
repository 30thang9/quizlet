// Folders Types

export interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  parentId?: string;
  studySetCount: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  children?: Folder[];
}

export interface FolderTree {
  folders: Folder[];
}
