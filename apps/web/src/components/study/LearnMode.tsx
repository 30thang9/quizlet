'use client';

import { useState, useCallback, useEffect } from 'react';
import { Brain, Check, X, ChevronRight, BookOpen, Zap } from 'lucide-react';
import { Card } from './StudySession';

interface LearnCard extends Card {
  easeFactor: number; // SM-2 algorithm: starting at 2.5
  interval: number; // days until next review
  repetitions: number; // successful reviews in a row
  nextReview: Date;
  lastResult?: 'again' | 'hard' | 'good' | 'easy';
}

interface LearnModeProps {
  cards: Card[];
  title: string;
  onComplete?: (results: { mastered: number; learning: number; new: number; accuracy: number }) => void;
  onExit?: () => void;
}

const INITIAL_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;

export function LearnMode({ cards, title, onComplete, onExit }: LearnModeProps) {
  const [learnCards, setLearnCards] = useState<LearnCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Initialize cards with SM-2 algorithm data
  const initializeCards = useCallback(() => {
    return cards.map((card) => ({
      ...card,
      easeFactor: INITIAL_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      nextReview: new Date(),
    }));
  }, [cards]);

  // Get due cards (cards that need review)
  const getDueCards = useCallback((allCards: LearnCard[]) => {
    const now = new Date();
    const dueCards = allCards.filter((card) => new Date(card.nextReview) <= now);
    // Sort by priority: new cards first, then by due date
    return dueCards.sort((a, b) => {
      if (a.repetitions === 0 && b.repetitions > 0) return -1;
      if (b.repetitions === 0 && a.repetitions > 0) return 1;
      return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
    });
  }, []);

  const startSession = () => {
    const initializedCards = initializeCards();
    setLearnCards(initializedCards);
    setIsStarted(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setSessionStats({ again: 0, hard: 0, good: 0, easy: 0 });
  };

  // Apply SM-2 algorithm
  const applySpacedRepetition = useCallback((card: LearnCard, quality: number) => {
    // Quality: 0 = again, 1 = hard, 2 = good, 3 = easy
    let { easeFactor, interval, repetitions } = card;

    if (quality < 2) {
      // Failed - reset
      repetitions = 0;
      interval = 1; // 1 day
    } else {
      // Success
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    }

    // Update ease factor
    easeFactor = easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
    if (easeFactor < MINIMUM_EASE_FACTOR) easeFactor = MINIMUM_EASE_FACTOR;

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return {
      ...card,
      easeFactor,
      interval,
      repetitions,
      nextReview,
      lastResult: ['again', 'hard', 'good', 'easy'][quality] as LearnCard['lastResult'],
    };
  }, []);

  const handleAnswer = useCallback((quality: number) => {
    setLearnCards((prev) => {
      const updated = [...prev];
      const currentCard = updated[currentIndex];
      const processedCard = applySpacedRepetition(currentCard, quality);
      updated[currentIndex] = processedCard;

      // Update stats
      setSessionStats((stats) => ({
        ...stats,
        [processedCard.lastResult!]: stats[processedCard.lastResult as keyof typeof stats] + 1,
      }));

      return updated;
    });

    // Move to next card
    const dueCards = getDueCards(learnCards);
    const currentCardId = learnCards[currentIndex]?.id;
    const remainingCards = learnCards.filter(
      (c) => c.id !== currentCardId && new Date(c.nextReview) <= new Date()
    );

    if (remainingCards.length === 0) {
      // Session complete
      setTimeout(() => {
        setIsComplete(true);
        const mastered = learnCards.filter((c) => c.repetitions >= 3).length;
        const learning = learnCards.filter((c) => c.repetitions > 0 && c.repetitions < 3).length;
        const newCards = learnCards.filter((c) => c.repetitions === 0).length;
        const total = learnCards.length;
        const accuracy = total > 0 ? Math.round(((sessionStats.good + sessionStats.easy) / total) * 100) : 0;
        onComplete?.({ mastered, learning, new: newCards, accuracy });
      }, 500);
    } else {
      setCurrentIndex(learnCards.findIndex((c) => c.id !== currentCardId && new Date(c.nextReview) <= new Date()));
      setIsFlipped(false);
      setShowAnswer(false);
    }
  }, [currentIndex, learnCards, getDueCards, applySpacedRepetition, sessionStats, onComplete]);

  const dueCount = getDueCards(learnCards).length;

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <Brain className="w-16 h-16 text-purple-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">
            Learn uses spaced repetition to help you remember information long-term.
            Rate how well you know each card to optimize your study.
          </p>
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-purple-700">
              <BookOpen className="w-5 h-5" />
              <span>{cards.length} cards to learn</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onExit}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={startSession}
              className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const total = learnCards.length;
    const mastered = learnCards.filter((c) => c.repetitions >= 3).length;
    const learning = learnCards.filter((c) => c.repetitions > 0 && c.repetitions < 3).length;
    const newCards = learnCards.filter((c) => c.repetitions === 0).length;

    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
          <p className="text-gray-600 mb-8">Great job! Here's your progress:</p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">{mastered}</div>
              <div className="text-sm text-gray-500">Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500">{learning}</div>
              <div className="text-sm text-gray-500">Learning</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-400">{newCards}</div>
              <div className="text-sm text-gray-500">New</div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 mb-8 max-w-sm mx-auto">
            <div className="text-sm text-gray-600 space-y-1">
              <p>Again: <span className="font-semibold text-red-500">{sessionStats.again}</span></p>
              <p>Hard: <span className="font-semibold text-orange-500">{sessionStats.hard}</span></p>
              <p>Good: <span className="font-semibold text-green-500">{sessionStats.good}</span></p>
              <p>Easy: <span className="font-semibold text-blue-500">{sessionStats.easy}</span></p>
            </div>
          </div>

          <button
            onClick={onExit}
            className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  const currentCard = learnCards[currentIndex];
  if (!currentCard) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6 text-gray-500" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="text-sm text-purple-600 font-medium">
          {dueCount} due
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div
          className="h-full bg-purple-500 rounded-full transition-all"
          style={{ width: `${((learnCards.length - dueCount) / learnCards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8 min-h-64 flex flex-col items-center justify-center">
        {!showAnswer ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 mb-4">{currentCard.term}</p>
            <button
              onClick={() => setShowAnswer(true)}
              className="px-6 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Show Answer
            </button>
          </div>
        ) : (
          <div className="text-center w-full">
            <p className="text-lg text-gray-500 mb-2">{currentCard.term}</p>
            <p className="text-2xl font-bold text-purple-600 mb-8">{currentCard.definition}</p>
          </div>
        )}
      </div>

      {/* Answer Buttons */}
      {showAnswer && (
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => handleAnswer(0)}
            className="p-4 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
          >
            <div className="text-2xl mb-1">😓</div>
            <div className="font-semibold">Again</div>
            <div className="text-xs opacity-75">1 day</div>
          </button>
          <button
            onClick={() => handleAnswer(1)}
            className="p-4 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors"
          >
            <div className="text-2xl mb-1">🤔</div>
            <div className="font-semibold">Hard</div>
            <div className="text-xs opacity-75">1 day</div>
          </button>
          <button
            onClick={() => handleAnswer(2)}
            className="p-4 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
          >
            <div className="text-2xl mb-1">😊</div>
            <div className="font-semibold">Good</div>
            <div className="text-xs opacity-75">
              {currentCard.interval === 0 ? '1 day' : `${currentCard.interval} days`}
            </div>
          </button>
          <button
            onClick={() => handleAnswer(3)}
            className="p-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
          >
            <div className="text-2xl mb-1">🚀</div>
            <div className="font-semibold">Easy</div>
            <div className="text-xs opacity-75">4 days</div>
          </button>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="text-center mt-6 text-sm text-gray-400">
        Press 1-4 to rate, Space to show answer
      </div>
    </div>
  );
}
