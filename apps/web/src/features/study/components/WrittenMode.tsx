'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { FileText, Clock, Check, X, Trophy, RotateCcw, ChevronRight, Send } from 'lucide-react';
import { Card } from './StudySession';
import { useProgress } from '@/hooks/useProgress';

interface WrittenModeProps {
  cards: Card[];
  title: string;
  studySetId?: string;
  timeLimit?: number; // in seconds, 0 = no limit
  onComplete?: (results: { score: number; correct: number; incorrect: number; timeSpent: number }) => void;
  onExit?: () => void;
}

interface QuestionResult {
  cardId: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  caseSensitive: boolean;
}

export function WrittenMode({ cards, title, studySetId, timeLimit = 0, onComplete, onExit }: WrittenModeProps) {
  const [questions, setQuestions] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [timeSpent, setTimeSpent] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const sessionStartRef = useRef<number>(0);
  
  const progress = useProgress();
  const inputRef = useRef<HTMLInputElement>(null);

  const startMode = async () => {
    // Shuffle and select cards
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setIsStarted(true);
    setCurrentIndex(0);
    setUserAnswer('');
    setIsAnswered(false);
    setIsComplete(false);
    setTimeLeft(timeLimit);
    setTimeSpent(0);
    setResults([]);
    setIsReviewMode(false);
    sessionStartRef.current = Date.now();
    
    // Focus input
    setTimeout(() => inputRef.current?.focus(), 100);
    
    // Create session on backend
    const session = await progress.createSession({
      studySetId,
      mode: 'written',
    });
    if (session) {
      setSessionId(session.id);
    }
  };

  // Timer
  useEffect(() => {
    if (!isStarted || isComplete || isReviewMode || timeLimit === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishMode();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isComplete, isReviewMode, timeLimit]);

  const normalizeAnswer = (answer: string, caseSensitive: boolean = false): string => {
    let normalized = answer.trim();
    if (!caseSensitive) {
      normalized = normalized.toLowerCase();
    }
    // Remove extra spaces
    normalized = normalized.replace(/\s+/g, ' ');
    return normalized;
  };

  const checkAnswer = (userAnswerText: string, correctAnswer: string): boolean => {
    const normalizedUser = normalizeAnswer(userAnswerText);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    // Exact match
    if (normalizedUser === normalizedCorrect) return true;
    
    // Check if user answer contains the correct answer (for partial matches)
    if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 3) return true;
    
    // Check if correct answer is contained in user answer
    if (normalizedUser.includes(normalizedCorrect) && normalizedCorrect.length > 3) return true;
    
    return false;
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const currentCard = questions[currentIndex];
    const isCorrect = checkAnswer(userAnswer, currentCard.definition);
    
    setResults(prev => [...prev, {
      cardId: currentCard.id,
      question: currentCard.term,
      correctAnswer: currentCard.definition,
      userAnswer: userAnswer,
      isCorrect,
      caseSensitive: false,
    }]);
    
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswered(false);
      setShowHint(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      finishMode();
    }
  };

  const finishMode = useCallback(async () => {
    setIsComplete(true);
    setIsReviewMode(true);
    
    const correct = results.filter((r) => r.isCorrect).length;
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    const totalTimeSpent = timeLimit > 0 ? timeLimit - timeLeft : timeSpent;
    
    // Save to backend
    if (sessionId) {
      await progress.endSession(sessionId, {
        cardsStudied: questions.length,
        correctCount: correct,
        timeSpentSeconds: totalTimeSpent,
        mistakes: questions.length - correct,
        score,
      });
    }
    
    onComplete?.({
      score,
      correct,
      incorrect: questions.length - correct,
      timeSpent: totalTimeSpent,
    });
  }, [results, questions, timeLimit, timeLeft, timeSpent, sessionId, progress, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentCard = questions[currentIndex];

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">
            Type the definition for each term. This tests your recall ability!
          </p>
          <div className="bg-indigo-50 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-indigo-700">
              <FileText className="w-5 h-5" />
              <span>{cards.length} questions</span>
            </div>
            {timeLimit > 0 && (
              <div className="flex items-center justify-center gap-2 text-indigo-700">
                <Clock className="w-5 h-5" />
                <span>Time limit: {formatTime(timeLimit)}</span>
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onExit}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={startMode}
              className="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-semibold flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete && isReviewMode) {
    const correct = results.filter((r) => r.isCorrect).length;
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    
    let message = '';
    if (score >= 90) message = 'Excellent!';
    else if (score >= 70) message = 'Great job!';
    else if (score >= 50) message = 'Good effort!';
    else message = 'Keep practicing!';

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{message}</h2>
          <div className="text-6xl font-bold text-indigo-500 mb-4">{score}%</div>
          <p className="text-gray-600">You got {correct} out of {questions.length} correct</p>
        </div>

        {/* Results */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500">{correct}</div>
            <div className="text-sm text-gray-500">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500">{questions.length - correct}</div>
            <div className="text-sm text-gray-500">Incorrect</div>
          </div>
        </div>

        {/* Review Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsReviewMode(true)}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-semibold"
          >
            Review Answers
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={startMode}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6 text-gray-500" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          timeLimit > 0 
            ? (timeLeft <= 30 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600')
            : 'bg-gray-100 text-gray-600'
        }`}>
          {timeLimit > 0 && <Clock className="w-5 h-5" />}
          <span className="font-mono">
            {timeLimit > 0 ? formatTime(timeLeft) : `${currentIndex + 1}/${questions.length}`}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
        <div className="text-sm text-gray-500 mb-2">What is the definition of:</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-8">{currentCard.term}</h3>

        {/* Hint Toggle */}
        {!isAnswered && currentCard.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-indigo-500 hover:text-indigo-600 mb-4"
          >
            {showHint ? 'Hide hint' : 'Show hint'}
          </button>
        )}

        {showHint && currentCard.hint && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-700">💡 {currentCard.hint}</p>
          </div>
        )}

        {/* Answer Input */}
        <div className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isAnswered && userAnswer.trim()) {
                handleSubmit();
              } else if (e.key === 'Enter' && isAnswered) {
                handleNext();
              }
            }}
            disabled={isAnswered}
            placeholder="Type your answer..."
            className={`w-full p-4 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
              isAnswered
                ? currentCard.definition.toLowerCase().includes(userAnswer.toLowerCase().trim())
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-indigo-500'
            }`}
          />

          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="w-full py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-semibold flex items-center justify-center gap-2"
            >
              {currentIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                'Finish'
              )}
            </button>
          )}
        </div>

        {/* Show Result */}
        {isAnswered && (
          <div className={`mt-4 p-4 rounded-xl ${
            currentCard.definition.toLowerCase().includes(userAnswer.toLowerCase().trim())
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {currentCard.definition.toLowerCase().includes(userAnswer.toLowerCase().trim()) ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
              <span className="font-semibold">
                {currentCard.definition.toLowerCase().includes(userAnswer.toLowerCase().trim()) ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Correct answer: <span className="font-medium">{currentCard.definition}</span>
            </p>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-center mt-6 text-sm text-gray-400">
        Press Enter to submit, then Enter again for next
      </div>
    </div>
  );
}
