'use client';

import Link from 'next/link';
import { MoreHorizontal, Heart, Users, Eye } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils';

interface StudySetCardProps {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
  visibility: 'public' | 'private' | 'link';
  likeCount?: number;
  copyCount?: number;
  viewCount?: number;
  createdAt?: string;
  user?: {
    name: string;
    avatarUrl?: string;
  };
  isLiked?: boolean;
  isOwner?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
  onCopy?: (id: string) => void;
  className?: string;
}

export function StudySetCard({
  id,
  title,
  description,
  cardCount,
  visibility,
  likeCount = 0,
  copyCount = 0,
  viewCount = 0,
  user,
  isLiked = false,
  isOwner = false,
  onEdit,
  onDelete,
  onLike,
  onCopy,
  className,
}: StudySetCardProps) {
  const visibilityColors = {
    public: 'bg-green-100 text-green-700',
    private: 'bg-gray-100 text-gray-700',
    link: 'bg-blue-100 text-blue-700',
  };

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-200', className)}>
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <Link href={`/study-sets/${id}`} className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-sky-600 transition-colors">
                {title}
              </h3>
            </Link>
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCopy?.(id)}>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-700">{cardCount}</span> cards
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {formatNumber(likeCount)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {formatNumber(copyCount)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatNumber(viewCount)}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={cn('text-xs', visibilityColors[visibility])}
              >
                {visibility}
              </Badge>
              {user && (
                <span className="text-xs text-gray-500">
                  by {user.name}
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2',
                isLiked && 'text-red-500 hover:text-red-600'
              )}
              onClick={() => onLike?.(id)}
            >
              <Heart className={cn('h-4 w-4 mr-1', isLiked && 'fill-current')} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
