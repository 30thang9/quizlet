'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Settings, 
  Plus, 
  MoreHorizontal,
  UserPlus,
  Trash2,
  Copy,
  Edit
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { StudySetCard } from '@/features/study-sets/components';

interface ClassMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'member';
}

interface ClassStudySet {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
  visibility: 'public' | 'private' | 'link';
  user: { name: string };
}

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [classData, setClassData] = useState<{
    id: string;
    name: string;
    description: string;
    memberCount: number;
    studySetCount: number;
    owner: { name: string; avatarUrl?: string };
    members: ClassMember[];
    studySets: ClassStudySet[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sets' | 'members'>('sets');

  useEffect(() => {
    setTimeout(() => {
      setClassData({
        id: params.id as string,
        name: 'Biology 101',
        description: 'Introduction to Biology for freshman students. Learn about cells, genetics, and evolution.',
        memberCount: 45,
        studySetCount: 12,
        owner: { name: 'John Doe' },
        members: [
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'owner' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
          { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'member' },
          { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'member' },
        ],
        studySets: [
          { id: '1', title: 'Cell Biology Basics', cardCount: 25, visibility: 'public', user: { name: 'John Doe' } },
          { id: '2', title: 'Genetics Vocabulary', cardCount: 40, visibility: 'public', user: { name: 'Jane Smith' } },
          { id: '3', title: 'Evolution Terms', cardCount: 30, visibility: 'class', user: { name: 'John Doe' } },
        ],
      });
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-accent rounded"></div>
        <div className="h-48 bg-accent rounded-xl"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Class not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-accent rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{classData.name}</h1>
          <p className="text-muted-foreground">{classData.description}</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-sky-500 mb-2" />
            <p className="text-2xl font-bold">{classData.memberCount}</p>
            <p className="text-sm text-muted-foreground">Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{classData.studySetCount}</p>
            <p className="text-sm text-muted-foreground">Study Sets</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b">
        <button
          onClick={() => setActiveTab('sets')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'sets'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-muted-foreground hover:text-gray-900'
          )}
        >
          Study Sets
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'members'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-muted-foreground hover:text-gray-900'
          )}
        >
          Members ({classData.memberCount})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'sets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {classData.studySets.length} study sets in this class
            </p>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add study set
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classData.studySets.map((set) => (
              <StudySetCard
                key={set.id}
                id={set.id}
                title={set.title}
                description={set.description}
                cardCount={set.cardCount}
                visibility={set.visibility}
                user={set.user}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {classData.members.length} members
            </p>
            <Button size="sm" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Invite members
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {classData.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-4">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge 
                      variant={member.role === 'owner' ? 'default' : member.role === 'admin' ? 'secondary' : 'outline'}
                    >
                      {member.role}
                    </Badge>
                    {member.role !== 'owner' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Make admin</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
