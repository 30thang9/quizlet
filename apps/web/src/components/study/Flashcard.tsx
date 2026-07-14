'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface FlashcardProps {
  term: string;
  definition: string;
  imageUrl?: string;
  onFlip?: (isFlipped: boolean) => void;
}

export function Flashcard({ term, definition, imageUrl, onFlip }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    const newState = !isFlipped;
    setIsFlipped(newState);
    onFlip?.(newState);
  };

  return (
    <div 
      className="perspective-1000 w-full max-w-2xl mx-auto cursor-pointer"
      onClick={handleFlip}
    >
      <div
        className={cn(
          'relative w-full h-64 transition-transform duration-500 transform-style-3d',
          isFlipped && 'rotate-y-180'
        )}
      >
        {/* Front - Term */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-gray-200 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6">
          {imageUrl && (
            <Image 
              src={imageUrl} 
              alt={term}
              width={400}
              height={128}
              className="w-full h-32 object-contain mb-4 rounded-lg"
            />
          )}
          <h2 className="text-2xl font-bold text-gray-800 text-center">{term}</h2>
          <p className="text-sm text-gray-400 mt-4">Click to flip</p>
        </div>

        {/* Back - Definition */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-6">
          <p className="text-xl text-center">{definition}</p>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
