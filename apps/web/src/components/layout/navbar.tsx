'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={cn('sticky top-0 z-40 border-b border-gray-200 bg-white', className)}>
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Quizlet</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link href="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="sm" className="hidden md:inline-flex">
              Create
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link
                href="/library"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Library
              </Link>
              <Link
                href="/folders"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Folders
              </Link>
              <Link
                href="/classes"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Classes
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
