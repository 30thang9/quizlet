'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useProgress, StudySession } from './useProgress';

export type StudyMode = 'flashcard' | 'learn' | 'test' | 'match';

export interface StudyCard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  imageUrl?: string;
}

export interface StudyState {
  session: StudySession | null;
  currentIndex: number;
  isComplete: boolean;
  correctCount: number;
  mistakes: number;
  startTime: number;
  answers: Array<{ cardId: string; correct: boolean; time: number }>;
}

const INITIAL_STATE: StudyState = {
  session: null,
  currentIndex: 0,
  isComplete: false,
  correctCount: 0,
  mistakes: 0,
  startTime: 0,
  answers: [],
};

export function useStudySession(mode: StudyMode = 'flashcard') {
  const progress = useProgress();
  const [state, setState] = useState<StudyState>(INITIAL_STATE);
  const [cards, setCards] = useState<StudyCard[]>([]);
  const startTimeRef = useRef<number>(0);

  const initializeSession = useCallback(async (studySetId: string, studyCards: StudyCard[]) => {
    startTimeRef.current = Date.now();
    setCards(studyCards);

    const session = await progress.createSession({
      studySetId,
      mode,
    });

    setState({
      session,
      currentIndex: 0,
      isComplete: false,
      correctCount: 0,
      mistakes: 0,
      startTime: Date.now(),
      answers: [],
    });

    return session;
  }, [mode, progress]);

  const answerCard = useCallback(async (cardId: string, isCorrect: boolean, quality?: number) => {
    const answerTime = Date.now() - startTimeRef.current;
    
    setState(prev => {
      const newAnswers = [...prev.answers, { cardId, correct: isCorrect, time: answerTime }];
      const newCorrectCount = isCorrect ? prev.correctCount + 1 : prev.correctCount;
      const newMistakes = isCorrect ? prev.mistakes : prev.mistakes + 1;

      // Send review to backend if quality is provided (for learn mode with SM-2)
      if (quality !== undefined && state.session) {
        progress.reviewCard({
          cardId,
          studySessionId: state.session.id,
          quality,
        });
      }

      return {
        ...prev,
        answers: newAnswers,
        correctCount: newCorrectCount,
        mistakes: newMistakes,
      };
    });

    return isCorrect;
  }, [progress, state.session]);

  const nextCard = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex >= cards.length - 1) {
        // Session complete
        return { ...prev, isComplete: true };
      }
      return { ...prev, currentIndex: prev.currentIndex + 1 };
    });
  }, [cards.length]);

  const previousCard = useCallback(() => {
    setState(prev => {
      if (prev.currentIndex <= 0) return prev;
      return { ...prev, currentIndex: prev.currentIndex - 1 };
    });
  }, []);

  const endSession = useCallback(async () => {
    if (!state.session) return null;

    const timeSpentSeconds = Math.floor((Date.now() - state.startTime) / 1000);
    const totalCards = cards.length;
    const score = totalCards > 0 ? Math.round((state.correctCount / totalCards) * 100) : 0;

    await progress.endSession(state.session.id, {
      cardsStudied: totalCards,
      correctCount: state.correctCount,
      timeSpentSeconds,
      mistakes: state.mistakes,
      score,
    });

    return {
      cardsStudied: totalCards,
      correctCount: state.correctCount,
      mistakes: state.mistakes,
      score,
      timeSpentSeconds,
    };
  }, [state.session, state.startTime, state.correctCount, state.mistakes, cards.length, progress]);

  const resetSession = useCallback(() => {
    setState(INITIAL_STATE);
    setCards([]);
    startTimeRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.session) {
        endSession();
      }
    };
  }, [state.session]);

  return {
    // State
    session: state.session,
    currentIndex: state.currentIndex,
    currentCard: cards[state.currentIndex] || null,
    isComplete: state.isComplete,
    correctCount: state.correctCount,
    mistakes: state.mistakes,
    totalCards: cards.length,
    score: cards.length > 0 ? Math.round((state.correctCount / cards.length) * 100) : 0,
    progress: cards.length > 0 ? ((state.currentIndex + 1) / cards.length) * 100 : 0,
    
    // Actions
    initializeSession,
    answerCard,
    nextCard,
    previousCard,
    endSession,
    resetSession,
    
    // Loading/Error
    loading: progress.loading,
    error: progress.error,
  };
}
