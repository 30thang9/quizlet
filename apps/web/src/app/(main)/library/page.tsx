'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Grid, List, MoreHorizontal, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StudySet {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  visibility: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function LibraryPage() {
  const [sets, setSets] = useState<StudySet[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setSets([
        {
          id: '1',
          title: 'Biology 101 - Cell Biology',
          description: 'Key vocabulary for cell biology course',
          cardCount: 45,
          visibility: 'public',
          createdAt: '2024-01-10',
          user: { name: 'John Doe' },
        },
        {
          id: '2',
          title: 'Spanish Vocabulary - Beginner',
          description: 'Essential Spanish words for beginners',
          cardCount: 120,
          visibility: 'public',
          createdAt: '2024-01-09',
          user: { name: 'John Doe' },
        },
        {
          id: '3',
          title: 'World History - Ancient Civilizations',
          description: 'Key facts about ancient Egypt, Greece, and Rome',
          cardCount: 60,
          visibility: 'private',
          createdAt: '2024-01-08',
          user: { name: 'John Doe' },
        },
        {
          id: '4',
          title: 'Chemistry Formulas',
          description: 'Common chemistry equations and formulas',
          cardCount: 35,
          visibility: 'public',
          createdAt: '2024-01-07',
          user: { name: 'John Doe' },
        },
        {
          id: '5',
          title: 'French Verbs Conjugation',
          description: 'Essential French verb tenses',
          cardCount: 80,
          visibility: 'public',
          createdAt: '2024-01-06',
          user: { name: 'John Doe' },
        },
        {
          id: '6',
          title: 'AP Psychology Terms',
          description: 'Key psychology concepts for AP exam',
          cardCount: 150,
          visibility: 'public',
          createdAt: '2024-01-05',
          user: { name: 'John Doe' },
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredSets = sets.filter((set) =>
    set.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-accent rounded"></div>
        <div className="h-12 bg-accent rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-accent rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Library</h1>
          <p className="text-muted-foreground mt-1">
            {sets.length} study sets
          </p>
        </div>
        <Link href="/sets/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create new set
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 border rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent' : ''}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-accent' : ''}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Folders Section */}
      <div className="p-4 bg-accent/50 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Folder className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium">Folders</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-card border rounded-lg text-sm hover:bg-accent transition">
            All Sets
          </button>
          <button className="px-4 py-2 bg-card border rounded-lg text-sm hover:bg-accent transition">
            Favorites
          </button>
          <button className="px-4 py-2 bg-card border rounded-lg text-sm hover:bg-accent transition">
            Created by Me
          </button>
        </div>
      </div>

      {/* Study Sets Grid/List */}
      {filteredSets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No study sets found</p>
          <Link href="/sets/create">
            <Button>Create your first set</Button>
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSets.map((set) => (
            <Link key={set.id} href={`/sets/${set.id}`}>
              <div className="group p-4 bg-card rounded-xl border hover:shadow-md transition cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold line-clamp-2 flex-1">{set.title}</h3>
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent rounded transition">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {set.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{set.cardCount} cards</span>
                  <span className="capitalize">{set.visibility}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredSets.map((set) => (
            <Link key={set.id} href={`/sets/${set.id}`}>
              <div className="group flex items-center gap-4 p-4 bg-card rounded-xl border hover:shadow-md transition cursor-pointer">
                <div className="flex-1">
                  <h3 className="font-semibold">{set.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {set.cardCount} cards • Created {set.createdAt}
                  </p>
                </div>
                <button className="p-2 hover:bg-accent rounded-lg transition">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
