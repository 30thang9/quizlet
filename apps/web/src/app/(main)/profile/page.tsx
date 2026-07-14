'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Edit, 
  BookOpen, 
  Users, 
  Heart, 
  Eye,
  Calendar,
  Globe,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StudySetGrid } from '@/features/study-sets/components';
import { cn } from '@/lib/utils/cn';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl?: string;
  coverUrl?: string;
  location?: string;
  website?: string;
  joinedAt: string;
  stats: {
    studySetsCount: number;
    classesCount: number;
    followersCount: number;
    followingCount: number;
    totalLikes: number;
    totalViews: number;
  };
  studySets: Array<{
    id: string;
    title: string;
    description?: string;
    cardCount: number;
    visibility: 'public' | 'private' | 'link';
    likeCount: number;
    copyCount: number;
    viewCount: number;
    user: { name: string };
  }>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sets' | 'classes' | 'likes'>('sets');

  useEffect(() => {
    // Mock data
    setTimeout(() => {
      setProfile({
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        bio: 'Passionate learner and educator. Love creating study materials for biology and languages.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        coverUrl: 'https://images.unsplash.com/photo-1536152470836-b943b246224c?w=1200',
        location: 'San Francisco, CA',
        website: 'https://johndoe.com',
        joinedAt: '2023-09-15',
        stats: {
          studySetsCount: 24,
          classesCount: 5,
          followersCount: 128,
          followingCount: 89,
          totalLikes: 456,
          totalViews: 2340,
        },
        studySets: [
          { id: '1', title: 'Cell Biology Basics', cardCount: 25, visibility: 'public', likeCount: 42, copyCount: 15, viewCount: 234, user: { name: 'John Doe' } },
          { id: '2', title: 'Spanish Vocabulary - Beginner', cardCount: 50, visibility: 'public', likeCount: 38, copyCount: 22, viewCount: 189, user: { name: 'John Doe' } },
          { id: '3', title: 'Chemistry Formulas', cardCount: 30, visibility: 'public', likeCount: 25, copyCount: 10, viewCount: 145, user: { name: 'John Doe' } },
        ],
      });
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-48 bg-accent rounded-xl"></div>
        <div className="h-24 bg-accent rounded-xl"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div 
        className="h-48 md:h-64 rounded-xl bg-cover bg-center relative"
        style={{ backgroundImage: `url(${profile.coverUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
      </div>

      {/* Profile Header */}
      <div className="relative px-4 -mt-16">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatarUrl} />
            <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button className="gap-2">
                <Edit className="w-4 h-4" />
                Edit profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bio & Info */}
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-700 mb-4">{profile.bio}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile.location && (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {profile.location}
              </span>
            )}
            {profile.website && (
              <a href={profile.website} className="flex items-center gap-1 hover:text-sky-600">
                <Mail className="w-4 h-4" />
                {profile.website}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <BookOpen className="w-6 h-6 mx-auto text-sky-500 mb-2" />
            <p className="text-2xl font-bold">{profile.stats.studySetsCount}</p>
            <p className="text-xs text-muted-foreground">Study Sets</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Users className="w-6 h-6 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{profile.stats.classesCount}</p>
            <p className="text-xs text-muted-foreground">Classes</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Heart className="w-6 h-6 mx-auto text-red-500 mb-2" />
            <p className="text-2xl font-bold">{profile.stats.totalLikes}</p>
            <p className="text-xs text-muted-foreground">Likes</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Eye className="w-6 h-6 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{profile.stats.totalViews}</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{profile.stats.followersCount}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{profile.stats.followingCount}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b">
        {(['sets', 'classes', 'likes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize',
              activeTab === tab
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-muted-foreground hover:text-gray-900'
            )}
          >
            {tab === 'sets' && <BookOpen className="w-4 h-4 inline mr-2" />}
            {tab === 'classes' && <Users className="w-4 h-4 inline mr-2" />}
            {tab === 'likes' && <Heart className="w-4 h-4 inline mr-2" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'sets' && (
        <StudySetGrid studySets={profile.studySets} />
      )}

      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-lg transition">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Class {i}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Description for class {i}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {10 + i * 5} members
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'likes' && (
        <StudySetGrid 
          studySets={profile.studySets.map((set) => ({
            ...set,
            isLiked: true,
          }))}
        />
      )}
    </div>
  );
}
