'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Zap, Brain, FileText, PenLine } from 'lucide-react';
import { StudySession, MatchMode, LearnMode, TestMode, WrittenMode, Card } from '@/features/study/components';

// Demo data - in production this would come from API
const demoStudySet = {
  id: '1',
  title: 'Spanish Vocabulary',
  description: 'Basic Spanish words and phrases',
  cardCount: 10,
  cards: [
    { id: '1', term: 'Hello', definition: 'Hola' },
    { id: '2', term: 'Goodbye', definition: 'Adiós' },
    { id: '3', term: 'Thank you', definition: 'Gracias' },
    { id: '4', term: 'Please', definition: 'Por favor' },
    { id: '5', term: 'Yes', definition: 'Sí' },
    { id: '6', term: 'No', definition: 'No' },
    { id: '7', term: 'Good morning', definition: 'Buenos días' },
    { id: '8', term: 'Good night', definition: 'Buenas noches' },
    { id: '9', term: 'How are you?', definition: '¿Cómo estás?' },
    { id: '10', term: 'I love you', definition: 'Te quiero' },
  ] as Card[],
};

type StudyMode = 'cards' | 'match' | 'learn' | 'test' | 'write' | null;

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const [studySet] = useState(demoStudySet);
  const [mode, setMode] = useState<StudyMode>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, fetch study set by params.id
    setTimeout(() => setIsLoading(false), 500);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (mode === 'cards') {
    return (
      <StudySession
        cards={studySet.cards}
        title={studySet.title}
        onExit={() => setMode(null)}
      />
    );
  }

  if (mode === 'match') {
    return (
      <MatchMode
        cards={studySet.cards}
        title={studySet.title}
        timeLimit={60}
        onExit={() => setMode(null)}
      />
    );
  }

  if (mode === 'learn') {
    return (
      <LearnMode
        cards={studySet.cards}
        title={studySet.title}
        onExit={() => setMode(null)}
      />
    );
  }

  if (mode === 'test') {
    return (
      <TestMode
        cards={studySet.cards}
        title={studySet.title}
        questionCount={10}
        timeLimit={120}
        onExit={() => setMode(null)}
      />
    );
  }

  if (mode === 'write') {
    return (
      <WrittenMode
        cards={studySet.cards}
        title={studySet.title}
        timeLimit={0}
        onExit={() => setMode(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6 text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{studySet.title}</h1>
          <p className="text-gray-500">{studySet.cardCount} cards</p>
        </div>
      </div>

      {/* Study Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards Mode */}
        <button
          onClick={() => setMode('cards')}
          className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-sky-500 hover:shadow-lg transition-all text-left group"
        >
          <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500 transition-colors">
            <BookOpen className="w-6 h-6 text-sky-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Cards</h3>
          <p className="text-gray-500">
            Flip through flashcards and mark them as correct or incorrect. Great for memorization.
          </p>
        </button>

        {/* Match Mode */}
        <button
          onClick={() => setMode('match')}
          className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-lg transition-all text-left group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
            <Zap className="w-6 h-6 text-green-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Match</h3>
          <p className="text-gray-500">
            Match terms with their definitions against the clock. Fun and fast-paced!
          </p>
        </button>

        {/* Learn Mode */}
        <button
          onClick={() => setMode('learn')}
          className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all text-left group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
            <Brain className="w-6 h-6 text-purple-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Learn</h3>
          <p className="text-gray-500">
            Adaptive study that focuses on what you need to practice. Uses spaced repetition.
          </p>
        </button>

        {/* Test Mode */}
        <button
          onClick={() => setMode('test')}
          className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all text-left group"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
            <FileText className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Test</h3>
          <p className="text-gray-500">
            Take a multiple-choice quiz. See how well you know your material.
          </p>
        </button>

        {/* Write Mode */}
        <button
          onClick={() => setMode('write')}
          className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all text-left group"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors">
            <PenLine className="w-6 h-6 text-indigo-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Write</h3>
          <p className="text-gray-500">
            Type your answers to test your knowledge. Great for spelling practice.
          </p>
        </button>
      </div>
    </div>
  );
}
