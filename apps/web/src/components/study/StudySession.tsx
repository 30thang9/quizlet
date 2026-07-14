'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Check, RotateCcw } from 'lucide-react';
import { Flashcard } from './Flashcard';
import type { Card } from '@/types/api';

// Re-export Card type for convenience
export type { Card };

interface StudySessionProps {
  cards: Card[];
  title: string;
  onComplete?: (results: { correct: number; incorrect: number }) => void;
  onExit?: () => void;
}

export function StudySession({ cards, title, onComplete, onExit }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<{ correct: number; incorrect: number }>({
    correct: 0,
    incorrect: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleFlip = useCallback(() => {
    // Track when card is flipped
  }, []);

  const handleMark = useCallback((isCorrect: boolean) => {
    setResults((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
      onComplete?.({
        correct: results.correct + (isCorrect ? 1 : 0),
        incorrect: results.incorrect + (isCorrect ? 0 : 1),
      });
    }
  }, [currentIndex, cards.length, results, onComplete]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setResults({ correct: 0, incorrect: 0 });
    setIsComplete(false);
  };

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, cards.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComplete, handlePrevious, handleNext]);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <p className="text-gray-500 text-lg">No cards to study</p>
        <button
          onClick={onExit}
          className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((results.correct / cards.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Study Complete!</h2>
          <div className="text-6xl font-bold text-sky-500 mb-4">{percentage}%</div>
          <div className="flex gap-8 justify-center mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">{results.correct}</div>
              <div className="text-gray-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">{results.incorrect}</div>
              <div className="text-gray-500">Incorrect</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <RotateCcw className="w-5 h-5" />
              Study Again
            </button>
            <button
              onClick={onExit}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div
          className="h-full bg-sky-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      <Flashcard
        key={currentCard.id}
        term={currentCard.term}
        definition={currentCard.definition}
        imageUrl={currentCard.imageUrl}
        onFlip={handleFlip}
      />

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => handleMark(false)}
          className="flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
          Incorrect
        </button>
        <button
          onClick={() => handleMark(true)}
          className="flex items-center gap-2 px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg"
        >
          <Check className="w-5 h-5" />
          Correct
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
