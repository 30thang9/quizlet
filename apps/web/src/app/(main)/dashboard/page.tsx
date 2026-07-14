'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Brain, Trophy, Clock, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface StudySet {
  id: string;
  title: string;
  cardCount: number;
  updatedAt: string;
}

interface Stats {
  totalSets: number;
  totalCards: number;
  studyStreak: number;
  cardsStudied: number;
}

export default function DashboardPage() {
  const [recentSets, setRecentSets] = useState<StudySet[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSets: 0,
    totalCards: 0,
    studyStreak: 0,
    cardsStudied: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setRecentSets([
        { id: '1', title: 'Biology 101 - Cell Biology', cardCount: 45, updatedAt: '2024-01-10' },
        { id: '2', title: 'Spanish Vocabulary', cardCount: 120, updatedAt: '2024-01-09' },
        { id: '3', title: 'World History - Ancient Civilizations', cardCount: 60, updatedAt: '2024-01-08' },
      ]);
      setStats({
        totalSets: 12,
        totalCards: 850,
        studyStreak: 7,
        cardsStudied: 234,
      });
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-accent rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-accent rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">
          Ready to continue studying?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Total Sets"
          value={stats.totalSets}
          color="blue"
        />
        <StatCard
          icon={<Brain className="w-5 h-5" />}
          label="Total Cards"
          value={stats.totalCards}
          color="purple"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          label="Study Streak"
          value={`${stats.studyStreak} days`}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Cards Studied"
          value={stats.cardsStudied}
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/sets/create">
          <div className="p-6 bg-card rounded-xl border hover:border-primary transition cursor-pointer">
            <Plus className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold">Create Study Set</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Build a new flashcard deck
            </p>
          </div>
        </Link>
        <Link href="/study/learn/1">
          <div className="p-6 bg-card rounded-xl border hover:border-primary transition cursor-pointer">
            <Brain className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold">Learn Mode</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Study with adaptive learning
            </p>
          </div>
        </Link>
        <Link href="/study/match/1">
          <div className="p-6 bg-card rounded-xl border hover:border-primary transition cursor-pointer">
            <Trophy className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold">Match Game</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Test your memory
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Sets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Study Sets</h2>
          <Link href="/library" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSets.map((set) => (
            <Link key={set.id} href={`/sets/${set.id}`}>
              <div className="p-4 bg-card rounded-xl border hover:shadow-md transition cursor-pointer">
                <h3 className="font-medium mb-2 line-clamp-2">{set.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{set.cardCount} cards</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {set.updatedAt}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'blue' | 'purple' | 'orange' | 'green';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="p-4 bg-card rounded-xl border">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
