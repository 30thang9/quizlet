'use client';

import { useState, useCallback } from 'react';
import { Sparkles, Loader2, Copy, Check, Plus, Lightbulb } from 'lucide-react';
import { useGenerateFlashcards } from '@/features/ai/hooks';
import type { GeneratedCard, AIProvider, Difficulty, AIGeneratorProps } from '@/features/ai/types';

export function AIGenerator({ onAddCards, onClose }: AIGeneratorProps) {
  const [content, setContent] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [includeHints, setIncludeHints] = useState(true);
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [cards, setCards] = useState<GeneratedCard[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { generate, loading, error } = useGenerateFlashcards();

  const handleGenerate = useCallback(async () => {
    if (!content.trim() || content.trim().length < 50) return;

    setCards([]);
    const result = await generate({
      content,
      cardCount,
      difficulty,
      includeHints,
      provider,
    });

    if (result) {
      setCards(result.cards);
    }
  }, [content, cardCount, difficulty, includeHints, provider, generate]);

  const handleCopy = useCallback((card: GeneratedCard, index: number) => {
    navigator.clipboard.writeText(`${card.term}: ${card.definition}`);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const handleAddAll = useCallback(() => {
    if (cards.length > 0) {
      onAddCards?.(cards);
    }
  }, [cards, onAddCards]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Flashcard Generator</h2>
            <p className="text-sm text-gray-500">Generate flashcards from any text</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            ×
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste textbook content, notes, articles, or any educational material here..."
            className="w-full h-40 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            {content.length} characters {content.length < 50 && '(minimum 50)'}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cards</label>
            <select
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {[5, 10, 15, 20, 30, 50].map((n) => (
                <option key={n} value={n}>{n} cards</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
              <option value="claude">Claude</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHints}
                onChange={(e) => setIncludeHints(e.target.checked)}
                className="w-4 h-4 text-orange-500 rounded"
              />
              <span className="text-sm text-gray-700">Include hints</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || content.trim().length < 50}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating flashcards...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate {cardCount} Flashcards
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {cards.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Generated Flashcards ({cards.length})</h3>
            {onAddCards && (
              <button
                onClick={handleAddAll}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add All to Study Set
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cards.map((card, index) => (
              <div
                key={index}
                className="p-4 border rounded-xl hover:border-orange-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-600">{card.term}</h4>
                    <p className="text-gray-600 mt-1">{card.definition}</p>
                    {card.hint && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-yellow-600">
                        <Lightbulb className="w-4 h-4" />
                        {card.hint}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleCopy(card, index)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                    title="Copy"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
