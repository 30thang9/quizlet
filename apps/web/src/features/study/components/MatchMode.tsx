'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Trophy, RotateCcw, X, Check } from 'lucide-react';
import { Card } from './StudySession';
import { useProgress } from '@/features/study/hooks/useProgress';

interface MatchModeProps {
  cards: Card[];
  title: string;
  studySetId?: string;
  timeLimit?: number; // in seconds
  onComplete?: (results: { matches: number; timeSpent: number; mistakes: number; score: number }) => void;
  onExit?: () => void;
}

interface MatchItem {
  id: string;
  text: string;
  type: 'term' | 'definition';
  pairId: string;
  isMatched: boolean;
}

export function MatchMode({ cards, title, studySetId, timeLimit = 60, onComplete, onExit }: MatchModeProps) {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showMismatch, setShowMismatch] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionStartRef = useRef<number>(0);
  
  const progress = useProgress();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Initialize and shuffle items
  const initializeItems = useCallback(() => {
    const matchItems: MatchItem[] = [];
    
    cards.forEach((card) => {
      matchItems.push({
        id: `term-${card.id}`,
        text: card.term,
        type: 'term',
        pairId: card.id,
        isMatched: false,
      });
      matchItems.push({
        id: `def-${card.id}`,
        text: card.definition,
        type: 'definition',
        pairId: card.id,
        isMatched: false,
      });
    });

    // Shuffle
    for (let i = matchItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [matchItems[i], matchItems[j]] = [matchItems[j], matchItems[i]];
    }

    return matchItems;
  }, [cards]);

  const startGame = async () => {
    setItems(initializeItems());
    setSelectedIds([]);
    setMatches(0);
    setMistakes(0);
    setTimeLeft(timeLimit);
    setTimeSpent(0);
    setIsComplete(false);
    setIsStarted(true);
    sessionStartRef.current = Date.now();
    
    // Create session on backend
    const session = await progress.createSession({
      studySetId,
      mode: 'match',
    });
    if (session) {
      setSessionId(session.id);
    }
  };

  // Save results on completion
  const saveResults = useCallback(async () => {
    if (sessionId) {
      const totalTimeSpent = timeLimit > 0 && isComplete && matches < cards.length 
        ? timeLimit 
        : timeSpent;
      const score = cards.length > 0 ? Math.round((matches / cards.length) * 100) : 0;
      
      await progress.endSession(sessionId, {
        cardsStudied: cards.length,
        correctCount: matches,
        timeSpentSeconds: totalTimeSpent,
        mistakes,
        score,
      });
    }
  }, [sessionId, timeLimit, isComplete, matches, cards.length, timeSpent, mistakes, progress]);

  // Timer
  useEffect(() => {
    if (!isStarted || isComplete || matches === cards.length) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsComplete(true);
          return 0;
        }
        setTimeSpent((t) => t + 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isComplete, matches, cards.length]);

  // Check for completion
  useEffect(() => {
    if (matches === cards.length && cards.length > 0 && isStarted) {
      setIsComplete(true);
      saveResults();
      onCompleteRef.current?.({ matches, timeSpent, mistakes, score: 100 });
    }
  }, [matches, cards.length, isStarted, timeSpent, mistakes, saveResults]);

  // Save results when time runs out
  useEffect(() => {
    if (isComplete && matches < cards.length && timeLeft === 0 && sessionId) {
      saveResults();
    }
  }, [isComplete, matches, cards.length, timeLeft, sessionId, saveResults]);

  const handleSelect = (id: string) => {
    if (showMismatch) return;
    
    const item = items.find((i) => i.id === id);
    if (!item || item.isMatched) return;

    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      const first = items.find((i) => i.id === newSelected[0]);
      const second = items.find((i) => i.id === newSelected[1]);

      if (first && second && first.pairId === second.pairId && first.type !== second.type) {
        // Match!
        setItems((prev) =>
          prev.map((i) =>
            i.id === newSelected[0] || i.id === newSelected[1]
              ? { ...i, isMatched: true }
              : i
          )
        );
        setMatches((prev) => prev + 1);
        setSelectedIds([]);
      } else {
        // Mismatch
        setMistakes((prev) => prev + 1);
        setShowMismatch(true);
        setTimeout(() => {
          setShowMismatch(false);
          setSelectedIds([]);
        }, 800);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSelected = (id: string) => selectedIds.includes(id);
  const isCorrect = (id: string) => {
    if (selectedIds.length !== 2) return false;
    const item = items.find((i) => i.id === id);
    const first = items.find((i) => i.id === selectedIds[0]);
    return item && first && item.pairId === first.pairId && item.type !== first.type;
  };

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <Trophy className="w-16 h-16 text-sky-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">
            Match all the terms with their definitions as fast as you can!
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>Time Limit: {formatTime(timeLimit)}</span>
            </div>
            <div className="text-center mt-2 text-gray-500">
              {cards.length * 2} cards to match
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
              onClick={startGame}
              className="px-8 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-semibold"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const isWin = matches === cards.length;
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center">
          {isWin ? (
            <>
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Great Job!</h2>
            </>
          ) : (
            <>
              <Clock className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
            </>
          )}
          <p className="text-gray-600 mb-6">
            {isWin ? 'You matched all the cards!' : `You matched ${matches} out of ${cards.length}`}
          </p>
          <div className="flex gap-8 justify-center mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500">{matches}</div>
              <div className="text-gray-500">Matches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500">{mistakes}</div>
              <div className="text-gray-500">Mistakes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sky-500">{formatTime(timeSpent)}</div>
              <div className="text-gray-500">Time</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
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
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-600'
        }`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${(matches / cards.length) * 100}%` }}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            disabled={item.isMatched}
            className={`
              p-4 rounded-xl text-center transition-all duration-200 min-h-20
              ${item.isMatched 
                ? 'bg-green-100 border-2 border-green-500' 
                : isSelected(item.id) 
                  ? showMismatch 
                    ? 'bg-red-100 border-2 border-red-500' 
                    : 'bg-sky-100 border-2 border-sky-500' 
                  : 'bg-white border-2 border-gray-200 hover:border-sky-300 hover:shadow-md'
              }
              ${item.isMatched ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            <span className={`text-sm font-medium ${
              item.isMatched ? 'text-green-700' : 'text-gray-700'
            }`}>
              {item.text.length > 30 ? item.text.substring(0, 30) + '...' : item.text}
            </span>
            {item.isMatched && (
              <Check className="w-5 h-5 text-green-500 mx-auto mt-2" />
            )}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Matches:</span>
          <span className="font-semibold text-green-600">{matches}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Mistakes:</span>
          <span className="font-semibold text-red-600">{mistakes}</span>
        </div>
      </div>
    </div>
  );
}
