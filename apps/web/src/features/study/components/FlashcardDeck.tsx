'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Volume2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface Card {
  id: string;
  term: string;
  definition: string;
  imageUrl?: string;
  audioUrl?: string;
}

interface FlashcardDeckProps {
  cards: Card[];
  initialIndex?: number;
  onComplete?: () => void;
  className?: string;
}

export function FlashcardDeck({
  cards,
  initialIndex = 0,
  onComplete,
  className,
}: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());

  const shuffledCards = isShuffled
    ? [...cards].sort(() => Math.random() - 0.5)
    : cards;

  const currentCard = shuffledCards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!reviewedCards.has(currentCard.id)) {
      setReviewedCards(new Set([...reviewedCards, currentCard.id]));
    }
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCards(new Set());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        handleNext();
        break;
      case 'ArrowLeft':
        handlePrevious();
        break;
      case ' ':
      case 'Enter':
        handleFlip();
        break;
    }
  };

  return (
    <div
      className={cn('flex flex-col items-center', className)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span>
            {reviewedCards.size} reviewed
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="relative w-full max-w-2xl h-80 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={cn(
            'absolute inset-0 transition-transform duration-500 transform-style-3d',
            isFlipped ? 'rotate-y-180' : ''
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white border-2 border-gray-200 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-sm text-muted-foreground mb-2">Term</span>
            <p className="text-2xl font-bold text-center">{currentCard.term}</p>
            {currentCard.imageUrl && (
              <Image
                src={currentCard.imageUrl}
                alt={currentCard.term}
                width={400}
                height={128}
                className="mt-4 max-h-32 object-contain rounded-lg"
              />
            )}
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-sky-50 border-2 border-sky-200 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <span className="text-sm text-muted-foreground mb-2">Definition</span>
            <p className="text-2xl font-bold text-center">{currentCard.definition}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button onClick={handleFlip} className="min-w-32">
          {isFlipped ? 'Show Term' : 'Show Definition'}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4">
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button
          variant={isShuffled ? 'secondary' : 'ghost'}
          size="sm"
          onClick={handleShuffle}
        >
          <Shuffle className="h-4 w-4 mr-2" />
          {isShuffled ? 'Unshuffle' : 'Shuffle'}
        </Button>
      </div>

      {/* Keyboard Hint */}
      <p className="text-xs text-muted-foreground mt-4">
        Use arrow keys to navigate, Space to flip
      </p>
    </div>
  );
}
