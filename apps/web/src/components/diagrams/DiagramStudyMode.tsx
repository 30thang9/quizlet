'use client';

import { useState, useCallback, useEffect } from 'react';
import { Brain, Target, Check, X, Lightbulb, RotateCcw, Trophy, ChevronRight } from 'lucide-react';

interface DiagramLabel {
  id: string;
  xPosition: number;
  yPosition: number;
  term: string;
  definition: string;
  hint?: string;
}

interface DiagramStudyModeProps {
  diagram: {
    id: string;
    title: string;
    imageUrl: string;
  };
  labels: DiagramLabel[];
  mode: 'learn' | 'write' | 'match';
  onComplete?: (results: { correct: number; incorrect: number; accuracy: number }) => void;
  onExit?: () => void;
}

type StudyState = 'intro' | 'question' | 'answer' | 'complete';

export function DiagramStudyMode({
  diagram,
  labels,
  mode,
  onComplete,
  onExit,
}: DiagramStudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<StudyState>('intro');
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<{ correct: number; incorrect: number }>({ correct: 0, incorrect: 0 });
  const [matchingLabels, setMatchingLabels] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);

  const currentLabel = labels[currentIndex];
  const totalQuestions = labels.length;

  // Shuffle labels for study
  const [studyLabels, setStudyLabels] = useState<DiagramLabel[]>([]);
  
  useEffect(() => {
    const shuffled = [...labels].sort(() => Math.random() - 0.5);
    setStudyLabels(shuffled);
  }, [labels]);

  const startStudy = () => {
    setCurrentIndex(0);
    setState('question');
    setResults({ correct: 0, incorrect: 0 });
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const checkAnswer = useCallback(() => {
    if (mode === 'write') {
      const correct = userAnswer.trim().toLowerCase() === currentLabel.term.toLowerCase();
      setIsCorrect(correct);
      setResults((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
      }));
    } else if (mode === 'learn') {
      setIsCorrect(true);
    }
    setState('answer');
  }, [mode, userAnswer, currentLabel]);

  const nextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setState('question');
      setUserAnswer('');
      setIsCorrect(null);
      setShowHint(false);
      setSelectedPosition(null);
    } else {
      setState('complete');
      const finalResults = results;
      onComplete?.({
        correct: finalResults.correct,
        incorrect: finalResults.incorrect,
        accuracy: Math.round((finalResults.correct / totalQuestions) * 100),
      });
    }
  };

  const handlePositionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSelectedPosition({ x, y });

    // Check if correct position
    const tolerance = 10; // percentage tolerance
    const isCorrectPosition =
      Math.abs(x - currentLabel.xPosition) < tolerance &&
      Math.abs(y - currentLabel.yPosition) < tolerance;

    setIsCorrect(isCorrectPosition);
    setResults((prev) => ({
      correct: prev.correct + (isCorrectPosition ? 1 : 0),
      incorrect: prev.incorrect + (isCorrectPosition ? 0 : 1),
    }));
    setState('answer');
  };

  // Intro Screen
  if (state === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          {mode === 'learn' && <Brain className="w-16 h-16 text-blue-500 mx-auto mb-6" />}
          {mode === 'write' && <Target className="w-16 h-16 text-green-500 mx-auto mb-6" />}
          {mode === 'match' && <Target className="w-16 h-16 text-purple-500 mx-auto mb-6" />}

          <h2 className="text-2xl font-bold mb-4">{diagram.title}</h2>
          <p className="text-gray-600 mb-6">
            {mode === 'learn' && 'Learn the labels on this diagram with adaptive questions.'}
            {mode === 'write' && 'Type the correct label for each highlighted point.'}
            {mode === 'match' && 'Click on the diagram to match labels to their positions.'}
          </p>

          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              <strong>{totalQuestions}</strong> labels to study
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onExit}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={startStudy}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold flex items-center gap-2"
            >
              Start {mode === 'learn' ? 'Learning' : mode === 'write' ? 'Writing' : 'Matching'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (state === 'complete') {
    const accuracy = Math.round((results.correct / totalQuestions) * 100);
    let message = '';
    if (accuracy >= 90) message = 'Perfect!';
    else if (accuracy >= 70) message = 'Great job!';
    else if (accuracy >= 50) message = 'Good effort!';
    else message = 'Keep practicing!';

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <Trophy className="w-20 h-20 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">{message}</h2>
          <div className="text-6xl font-bold text-orange-500">{accuracy}%</div>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500">{results.correct}</div>
            <div className="text-sm text-gray-500">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500">{results.incorrect}</div>
            <div className="text-sm text-gray-500">Incorrect</div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={startStudy}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Study Again
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

  // Question/Answer Screen
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onExit} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6 text-gray-500" />
        </button>
        <div className="text-sm text-gray-500">
          {currentIndex + 1} / {totalQuestions}
        </div>
        <div className="w-32 h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-orange-500 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Image */}
      <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-6">
        <img
          src={diagram.imageUrl}
          alt={diagram.title}
          className="w-full h-auto max-h-96 object-contain"
        />

        {/* Current label marker (only in learn mode) */}
        {mode === 'learn' && state === 'question' && currentLabel && (
          <div
            className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full border-4 border-white shadow-lg z-10"
            style={{ left: `${currentLabel.xPosition}%`, top: `${currentLabel.yPosition}%` }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              ?
            </span>
          </div>
        )}

        {/* Position markers (for match mode) */}
        {mode === 'match' && state === 'question' && studyLabels.map((label, idx) => (
          <div
            key={label.id || idx}
            className="absolute px-2 py-1 bg-purple-500 text-white text-xs rounded-full -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${label.xPosition}%`, top: `${label.yPosition}%` }}
          >
            {idx + 1}
          </div>
        ))}

        {/* Clickable area for match mode */}
        {mode === 'match' && state === 'question' && (
          <div
            className="absolute inset-0 cursor-crosshair"
            onClick={handlePositionClick}
          />
        )}

        {/* Show answer marker */}
        {state === 'answer' && currentLabel && (
          <div
            className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-lg z-10 ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ left: `${currentLabel.xPosition}%`, top: `${currentLabel.yPosition}%` }}
          >
            {isCorrect ? (
              <Check className="w-5 h-5 text-white mx-auto my-auto" />
            ) : (
              <X className="w-5 h-5 text-white mx-auto my-auto" />
            )}
          </div>
        )}
      </div>

      {/* Question/Answer Area */}
      <div className="bg-white border rounded-xl p-6">
        {state === 'question' && currentLabel && (
          <>
            <p className="text-sm text-gray-500 mb-2">
              {mode === 'learn' && 'What label is at this marker?'}
              {mode === 'write' && 'Type the correct label:'}
              {mode === 'match' && `Match label ${currentIndex + 1}: "${currentLabel.term}"`}
            </p>

            {mode === 'learn' && (
              <>
                {currentLabel.hint && !showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="flex items-center gap-2 text-yellow-600 mb-4"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Show hint
                  </button>
                )}
                {showHint && (
                  <p className="text-yellow-600 mb-4 italic">💡 {currentLabel.hint}</p>
                )}
              </>
            )}

            {mode === 'write' && (
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg focus:border-orange-500 focus:ring-0"
                autoFocus
              />
            )}

            <button
              onClick={checkAnswer}
              disabled={mode === 'write' && !userAnswer.trim()}
              className="mt-4 px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Check Answer
            </button>
          </>
        )}

        {state === 'answer' && currentLabel && (
          <>
            <div className={`flex items-center gap-3 mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? (
                <>
                  <Check className="w-6 h-6" />
                  <span className="font-semibold">Correct!</span>
                </>
              ) : (
                <>
                  <X className="w-6 h-6" />
                  <span className="font-semibold">Incorrect</span>
                </>
              )}
            </div>

            {!isCorrect && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Correct answer:</p>
                <p className="font-semibold text-lg">{currentLabel.term}</p>
              </div>
            )}

            <p className="text-gray-600">{currentLabel.definition}</p>

            <button
              onClick={nextQuestion}
              className="mt-6 px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold flex items-center gap-2"
            >
              {currentIndex < totalQuestions - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                'Finish'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
