'use client';

import { useState, useCallback } from 'react';
import { Search, Image, X, Loader2, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageSearchProps {
  searchQuery?: string;
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
    small: string;
    regular: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    link: string;
  };
  links: {
    html: string;
  };
}

export function ImageSearch({ searchQuery = '', onSelect, onClose }: ImageSearchProps) {
  const [query, setQuery] = useState(searchQuery);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock image search results for demo (in production, use Unsplash API or AI)
  const mockImageSearch = async (q: string): Promise<UnsplashImage[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock results based on query
    const mockImages: UnsplashImage[] = [];
    for (let i = 0; i < 9; i++) {
      mockImages.push({
        id: `mock-${i}-${Date.now()}`,
        urls: {
          thumb: `https://picsum.photos/seed/${q}-${i}/200/150`,
          small: `https://picsum.photos/seed/${q}-${i}/400/300`,
          regular: `https://picsum.photos/seed/${q}-${i}/800/600`,
        },
        alt_description: `${q} image ${i + 1}`,
        user: {
          name: 'Demo User',
          link: 'https://example.com',
        },
        links: {
          html: 'https://example.com',
        },
      });
    }
    
    return mockImages;
  };

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In production, replace with actual API call:
      // const response = await fetch(`/api/images/search?q=${encodeURIComponent(query)}`);
      // const data = await response.json();
      
      // For now, use mock data
      const results = await mockImageSearch(query);
      setImages(results);
      
      if (results.length === 0) {
        setError('No images found. Try a different search term.');
      }
    } catch (err) {
      console.error('Image search error:', err);
      setError('Failed to search images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Search Images</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for images..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
          
          {/* AI-powered badge */}
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <span className="mr-1">✨</span> AI-powered search
            </span>
            <span className="text-xs text-gray-500">
              Finds relevant images for your flashcards
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="text-center py-8 text-gray-500">
              <p>{error}</p>
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image.urls.regular
                      ? 'border-sky-500 ring-2 ring-sky-200'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(image.urls.regular)}
                >
                  <img
                    src={image.urls.small}
                    alt={image.alt_description || 'Search result'}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                    {selectedImage === image.urls.regular && (
                      <div className="absolute inset-0 flex items-center justify-center bg-sky-500/30">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 text-sky-500" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Attribution */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">
                      by {image.user.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!images.length && !isLoading && !error && (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Search for images to add to your flashcards
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try searching for the term or concept you want to illustrate
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50 rounded-b-xl">
          <div className="text-sm text-gray-500">
            {selectedImage ? (
              <span className="text-sky-600">1 image selected</span>
            ) : (
              'Select an image'
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSelect}
              disabled={!selectedImage}
            >
              Add Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
