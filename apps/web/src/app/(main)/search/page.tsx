'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/features/search/components';
import { BookOpen, Filter, TrendingUp, Clock, SortAsc, User } from 'lucide-react';
import Link from 'next/link';

interface StudySet {
  id: string;
  title: string;
  description?: string;
  cardCount: number;
  viewCount: number;
  likeCount: number;
  visibility: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  tags?: { id: string; name: string; color: string }[];
  createdAt: string;
}

interface SearchResult {
  studySets: StudySet[];
  total: number;
  page: number;
  totalPages: number;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('relevance');

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          page: page.toString(),
          limit: '20',
        });
        if (sortBy !== 'relevance') {
          params.set('sortBy', sortBy);
        }

        const response = await fetch(`/api/search/study-sets?${params}`);
        const data = await response.json();
        setResults(data);
      } catch {
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, page, sortBy]);

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams.toString());
    if (newSort !== 'relevance') {
      params.set('sortBy', newSort);
    } else {
      params.delete('sortBy');
    }
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  };

  const sortOptions = [
    { id: 'relevance', label: 'Relevance', icon: Filter },
    { id: 'popular', label: 'Most Popular', icon: TrendingUp },
    { id: 'created', label: 'Most Recent', icon: Clock },
    { id: 'alphabetical', label: 'Alphabetical', icon: SortAsc },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Study Sets</h1>
        <SearchBar variant="page" autoFocus={!query} />
        
        {query && (
          <p className="mt-4 text-gray-600">
            Results for <span className="font-medium">"{query}"</span>
          </p>
        )}
      </div>

      {/* Filters */}
      {query && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSortChange(option.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  sortBy === option.id
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <option.icon className="w-4 h-4" />
                {option.label}
              </button>
            ))}
          </div>
          {results && (
            <p className="text-sm text-gray-500">
              {results.total.toLocaleString()} results
            </p>
          )}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
        </div>
      ) : !query ? (
        <div className="text-center py-16 text-gray-500">
          <SearchBar variant="page" autoFocus />
          <p className="mt-8">Enter a search term to find study sets</p>
        </div>
      ) : results && results.studySets.length > 0 ? (
        <div className="space-y-4">
          {results.studySets.map((studySet) => (
            <Link
              key={studySet.id}
              href={`/study-sets/${studySet.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-sky-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {studySet.title}
                  </h3>
                  {studySet.description && (
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                      {studySet.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {studySet.user.name}
                    </span>
                    <span>{studySet.cardCount} cards</span>
                    <span>{studySet.viewCount} views</span>
                    <span>{studySet.likeCount} likes</span>
                  </div>
                  {studySet.tags && studySet.tags.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {studySet.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 rounded text-xs"
                          style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {/* Pagination */}
          {results.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('page', (page - 1).toString());
                    router.push(`/search?${params.toString()}`);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              <span className="px-4 py-2">
                Page {page} of {results.totalPages}
              </span>
              {page < results.totalPages && (
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('page', (page + 1).toString());
                    router.push(`/search?${params.toString()}`);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No results found</h2>
          <p className="text-gray-500">
            We couldn't find any study sets matching "{query}"
          </p>
          <p className="text-gray-400 mt-2">
            Try different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
