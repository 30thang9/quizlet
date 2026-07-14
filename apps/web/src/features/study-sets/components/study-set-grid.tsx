'use client';

import { StudySetCard, StudySetCardProps } from './study-set-card';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface StudySetGridProps {
  studySets: Omit<StudySetCardProps, 'onEdit' | 'onDelete' | 'onLike' | 'onCopy'>[];
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
  onCopy?: (id: string) => void;
  className?: string;
}

export function StudySetGrid({
  studySets,
  viewMode = 'grid',
  onViewModeChange,
  onEdit,
  onDelete,
  onLike,
  onCopy,
  className,
}: StudySetGridProps) {
  if (studySets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No study sets found</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-8 px-2"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-8 px-2"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studySets.map((set) => (
            <StudySetCard
              key={set.id}
              {...set}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onCopy={onCopy}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {studySets.map((set) => (
            <div
              key={set.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border hover:shadow-md transition"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{set.title}</h3>
                <p className="text-sm text-gray-500">
                  {set.cardCount} cards • {set.visibility}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{set.likeCount} likes</span>
                <span>{set.copyCount} copies</span>
                <span>{set.viewCount} views</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/study-sets/${set.id}`}
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike?.(set.id)}
                >
                  {set.isLiked ? 'Liked' : 'Like'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
