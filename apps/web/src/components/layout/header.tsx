'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, User, LogOut, Settings, Folder, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils/cn';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const router = useRouter();

  return (
    <header className={cn('sticky top-0 z-40 w-full border-b border-gray-200 bg-white', className)}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-sky-500" />
          <span className="text-xl font-bold">Quizlet</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/library" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Library
          </Link>
          <Link 
            href="/folders" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Folders
          </Link>
          <Link 
            href="/classes" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Classes
          </Link>
          <Link 
            href="/search" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Explore
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sets/create">
              Create
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/library')}>
                <Folder className="mr-2 h-4 w-4" />
                My Library
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
