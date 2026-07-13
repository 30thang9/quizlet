'use client';

import { useState, useCallback, useEffect } from 'react';
import { FileText, Clock, Check, X, Trophy, RotateCcw, ChevronRight } from 'lucide-react';
import { Card } from './StudySession';

interface TestModeProps {
  cards: Card[];
  title: string;
  questionCount?: number;
  timeLimit?: number; // in seconds, 0 = no limit
  onComplete?: (results: { score: number; correct: number; incorrect: number; timeSpent: number }) => void;
  onExit?: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  userAnswer?: number;
  isCorrect?: boolean;
}

export function TestMode({ cards, title, questionCount = 10, timeLimit = 0, onComplete, onExit }: TestModeProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Generate questions from cards
  const generateQuestions = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const selectedCards = shuffled.slice(0, Math.min(questionCount, cards.length));
    
    return selectedCards.map((card, index) => {
      // Get 3 random wrong answers
      const otherDefinitions = cards
        .filter((c) => c.id !== card.id)
        .map((c) => c.definition)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      // Combine with correct answer and shuffle
      const options = [...otherDefinitions, card.definition]
        .map((text, i) => ({ text, originalIndex: text === card.definition ? 4 : i }))
        .sort(() => Math.random() - 0.5);
      
      return {
        id: `q-${index}`,
        question: card.term,
        options: options.map((o) => o.text),
        correctIndex: options.findIndex((o) => o.text === card.definition),
      };
    });
  }, [cards, questionCount]);

  const startTest = () => {
    setQuestions(generateQuestions());
    setIsStarted(true);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsComplete(false);
    setTimeLeft(timeLimit);
    setTimeSpent(0);
    setIsReviewMode(false);
  };

  // Timer
  useEffect(() => {
    if (!isStarted || isComplete || isReviewMode || timeLimit === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto-submit
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isComplete, isReviewMode, timeLimit]);

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    // Mark question as correct/incorrect
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === currentIndex
          ? { ...q, userAnswer: index, isCorrect: index === q.correctIndex }
          : q
      )
    );
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    setIsComplete(true);
    setIsReviewMode(true);
    
    const correct = questions.filter((q) => q.isCorrect).length;
    const timeSpentSeconds = timeLimit > 0 ? timeLimit - timeLeft : timeSpent;
    onComplete?.({
      score: Math.round((correct / questions.length) * 100),
      correct,
      incorrect: questions.length - correct,
      timeSpent: timeSpentSeconds,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">
            Test yourself with multiple choice questions. Choose the correct definition for each term.
          </p>
          <div className="bg-orange-50 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-orange-700">
              <FileText className="w-5 h-5" />
              <span>{Math.min(questionCount, cards.length)} questions</span>
            </div>
            {timeLimit > 0 && (
              <div className="flex items-center justify-center gap-2 text-orange-700">
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
              onClick={startTest}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete && isReviewMode) {
    const correct = questions.filter((q) => q.isCorrect).length;
    const score = Math.round((correct / questions.length) * 100);
    const percentage = score;
    
    let message = '';
    if (percentage >= 90) message = 'Excellent!';
    else if (percentage >= 70) message = 'Great job!';
    else if (percentage >= 50) message = 'Good effort!';
    else message = 'Keep practicing!';

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{message}</h2>
          <div className="text-6xl font-bold text-orange-500 mb-4">{percentage}%</div>
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
          {timeLimit > 0 && (
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500">{formatTime(timeLimit - timeLeft)}</div>
              <div className="text-sm text-gray-500">Time</div>
            </div>
          )}
        </div>

        {/* Review Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsReviewMode(true)}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
          >
            Review Answers
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={startTest}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Test
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

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
            ? (timeLeft <= 30 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600')
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
          className="h-full bg-orange-500 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
        <div className="text-sm text-gray-500 mb-2">What is the definition of:</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctIndex;
            const showResult = isAnswered;

            let optionClass = 'border-gray-200 hover:border-orange-300 hover:bg-orange-50';
            if (showResult) {
              if (isCorrect) {
                optionClass = 'border-green-500 bg-green-50 text-green-700';
              } else if (isSelected && !isCorrect) {
                optionClass = 'border-red-500 bg-red-50 text-red-700';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                    isSelected ? 'border-current' : 'border-gray-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && <Check className="w-5 h-5 text-green-500" />}
                  {showResult && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      {isAnswered && (
        <div className="flex justify-center">
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold flex items-center gap-2"
          >
            {currentIndex < questions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'Finish Test'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
