'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Library, 
  Folder, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Search,
  Bookmark,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Folders', href: '/folders', icon: Folder },
  { name: 'Classes', href: '/classes', icon: Users },
  { name: 'Search', href: '/search', icon: Search },
];

const quickLinks = [
  { name: 'Recently Studied', href: '/recent', icon: Clock },
  { name: 'Saved', href: '/saved', icon: Bookmark },
  { name: 'Study Stats', href: '/stats', icon: BarChart3 },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('w-64 border-r border-gray-200 bg-white', className)}>
      <div className="flex h-full flex-col">
        {/* Create Button */}
        <div className="p-4">
          <Button className="w-full" asChild>
            <Link href="/sets/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Set
            </Link>
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-6">
            <p className="px-3 text-xs font-semibold uppercase text-gray-400">
              Quick Links
            </p>
            <div className="mt-2 space-y-1">
              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Settings */}
        <div className="border-t border-gray-200 p-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
