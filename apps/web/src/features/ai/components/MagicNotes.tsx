'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Loader2, FileText, BookOpen, List } from 'lucide-react';
import { useMagicNotes } from '@/features/ai/hooks';
import type { GeneratedCard, AIProvider, MagicNotesProps } from '@/features/ai/types';

export function MagicNotes({ onAddCards, onClose }: MagicNotesProps) {
  const [content, setContent] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [summary, setSummary] = useState<string | null>(null);
  const [cards, setCards] = useState<GeneratedCard[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'summary' | 'cards'>('content');

  const { generate, loading, error } = useMagicNotes();

  const handleGenerate = useCallback(async () => {
    if (!content.trim() || content.trim().length < 100) return;

    setSummary(null);
    setCards([]);

    const result = await generate({
      content,
      cardCount,
      provider,
    });

    if (result) {
      setSummary(result.summary);
      setCards(result.flashcards);
      setActiveTab('summary');
    }
  }, [content, cardCount, provider, generate]);

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Magic Notes</h2>
              <p className="text-sm text-gray-500">Transform notes into study materials</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-2xl">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'content' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          Notes
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          disabled={!summary}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'summary' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'
          } ${!summary && 'opacity-50 cursor-not-allowed'}`}
        >
          <BookOpen className="w-4 h-4" />
          Summary
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          disabled={cards.length === 0}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'cards' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'
          } ${cards.length === 0 && 'opacity-50 cursor-not-allowed'}`}
        >
          <List className="w-4 h-4" />
          Flashcards ({cards.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste your notes or content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your class notes, textbook content, or any educational material..."
                className="w-full h-48 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none font-mono text-sm"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-500">
                  {content.length} characters {content.length < 100 && '(minimum 100)'}
                </p>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as AIProvider)}
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Gemini</option>
                  <option value="claude">Claude</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of cards</label>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {[5, 10, 15, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>{n} flashcards</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || content.trim().length < 100}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creating Magic Notes...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Create Magic Notes
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                {error}
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && summary && (
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <h3 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
            <button
              onClick={() => setActiveTab('cards')}
              className="w-full py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600"
            >
              View {cards.length} Flashcards
            </button>
          </div>
        )}

        {activeTab === 'cards' && cards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Generated Flashcards</h3>
              {onAddCards && (
                <button
                  onClick={() => onAddCards(cards)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm font-medium"
                >
                  Add All to Study Set
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cards.map((card, index) => (
                <div key={index} className="p-4 border rounded-xl">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-indigo-600">{card.term}</h4>
                      <p className="text-gray-600 mt-1">{card.definition}</p>
                      {card.hint && (
                        <p className="text-sm text-yellow-600 mt-2">💡 {card.hint}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'summary' && !summary && (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Generate Magic Notes to see the summary</p>
          </div>
        )}
        {activeTab === 'cards' && cards.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <List className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Generate Magic Notes to see flashcards</p>
          </div>
        )}
      </div>
    </div>
  );
}
