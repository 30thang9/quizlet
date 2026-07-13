'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, X, Filter, Clock, TrendingUp, Users, BookOpen } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
  user: {
    name: string;
    username: string;
  };
  tags?: { name: string; color: string }[];
  visibility: string;
}

interface SearchBarProps {
  variant?: 'header' | 'page';
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ variant = 'header', placeholder = 'Search study sets...', autoFocus = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const filters = [
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ q: searchQuery });
      if (selectedFilter === 'popular') params.set('sortBy', 'popular');
      if (selectedFilter === 'recent') params.set('sortBy', 'created');
      
      const response = await fetch(`/api/search/study-sets?${params}`);
      const data = await response.json();
      setResults(data.studySets || []);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set('q', query);
      if (selectedFilter === 'popular') params.set('sortBy', 'popular');
      if (selectedFilter === 'recent') params.set('sortBy', 'created');
      router.push(`/search?${params.toString()}`);
      setIsOpen(false);
    }
  };

  const handleResultClick = (resultId: string) => {
    router.push(`/study-sets/${resultId}`);
    setIsOpen(false);
    setQuery('');
  };

  const isLarge = variant === 'page';

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div
          className={`flex items-center gap-2 bg-white border rounded-full transition-all ${
            isOpen ? 'ring-2 ring-sky-500 border-transparent' : 'border-gray-200 hover:border-gray-300'
          } ${isLarge ? 'px-6 py-4' : 'px-4 py-2'}`}
        >
          <SearchIcon className={`text-gray-400 ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 ${
              isLarge ? 'text-lg' : 'text-sm'
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          {isLarge && (
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
            >
              Search
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      {isOpen && isLarge && (
        <div className="flex gap-2 mt-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(selectedFilter === filter.id ? null : filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-gray-200 shadow-xl max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full mx-auto mb-2" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                Study Sets
              </div>
              {results.slice(0, 8).map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <BookOpen className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{result.title}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {result.cardCount} cards • by {result.user.name}
                    </p>
                    {result.tags && result.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.name}
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
              {results.length > 8 && (
                <button
                  onClick={handleSubmit}
                  className="w-full px-4 py-3 text-center text-sky-600 hover:bg-sky-50 font-medium"
                >
                  View all {results.length} results
                </button>
              )}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center text-gray-500">
              <SearchIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-700">No results found</p>
              <p className="text-sm">Try different keywords or check spelling</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
