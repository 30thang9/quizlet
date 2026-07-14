'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Image as ImageIcon, Volume2, Save, X, Copy } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/lib/utils/cn';

export interface CardData {
  id: string;
  term: string;
  definition: string;
  imageUrl?: string;
  audioUrl?: string;
}

interface CardEditorProps {
  cards: CardData[];
  onChange: (cards: CardData[]) => void;
  onSave?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function CardEditor({
  cards,
  onChange,
  onSave,
  onCancel,
  className,
}: CardEditorProps) {
  const [localCards, setLocalCards] = useState<CardData[]>(cards);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const handleAddCard = () => {
    const newCard: CardData = {
      id: `new-${Date.now()}`,
      term: '',
      definition: '',
    };
    const updatedCards = [...localCards, newCard];
    setLocalCards(updatedCards);
    onChange(updatedCards);
    setEditingId(newCard.id);
  };

  const handleDeleteCard = (id: string) => {
    const updatedCards = localCards.filter((card) => card.id !== id);
    setLocalCards(updatedCards);
    onChange(updatedCards);
  };

  const handleUpdateCard = (id: string, field: keyof CardData, value: string) => {
    const updatedCards = localCards.map((card) =>
      card.id === id ? { ...card, [field]: value } : card
    );
    setLocalCards(updatedCards);
    onChange(updatedCards);
  };

  const handleDuplicateCard = (id: string) => {
    const cardToDuplicate = localCards.find((card) => card.id === id);
    if (cardToDuplicate) {
      const newCard: CardData = {
        ...cardToDuplicate,
        id: `new-${Date.now()}`,
        term: `${cardToDuplicate.term} (copy)`,
      };
      const index = localCards.findIndex((card) => card.id === id);
      const updatedCards = [
        ...localCards.slice(0, index + 1),
        newCard,
        ...localCards.slice(index + 1),
      ];
      setLocalCards(updatedCards);
      onChange(updatedCards);
    }
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= localCards.length) return;

    const updatedCards = [...localCards];
    [updatedCards[index], updatedCards[newIndex]] = [
      updatedCards[newIndex],
      updatedCards[index],
    ];
    setLocalCards(updatedCards);
    onChange(updatedCards);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Cards ({localCards.length})
        </h3>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {localCards.map((card, index) => (
          <div
            key={card.id}
            className={cn(
              'p-4 bg-white border rounded-lg transition-all',
              editingId === card.id
                ? 'border-sky-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex items-start gap-4">
              {/* Drag Handle */}
              <div className="pt-2 text-gray-400 cursor-grab">
                <GripVertical className="h-5 w-5" />
              </div>

              {/* Card Number */}
              <div className="pt-2 w-8 text-center text-sm font-medium text-gray-400">
                {index + 1}
              </div>

              {/* Card Fields */}
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Term"
                  value={card.term}
                  onChange={(e) => handleUpdateCard(card.id, 'term', e.target.value)}
                  onFocus={() => setEditingId(card.id)}
                  className="font-medium"
                />
                <Textarea
                  placeholder="Definition"
                  value={card.definition}
                  onChange={(e) => handleUpdateCard(card.id, 'definition', e.target.value)}
                  onFocus={() => setEditingId(card.id)}
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMoveCard(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  ↑ 
                </button>
                <button
                  onClick={() => handleMoveCard(index, 'down')}
                  disabled={index === localCards.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  ↓
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleDuplicateCard(card.id)}
                  className="p-2 text-gray-400 hover:text-sky-600"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Media Buttons */}
            <div className="flex gap-2 mt-2 ml-12">
              <button
                onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (url) handleUpdateCard(card.id, 'imageUrl', url);
                }}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 text-xs rounded border',
                  card.imageUrl
                    ? 'border-sky-500 text-sky-600 bg-sky-50'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                )}
              >
                <ImageIcon className="h-3 w-3" />
                Image
              </button>
              <button
                onClick={() => {
                  const url = prompt('Enter audio URL:');
                  if (url) handleUpdateCard(card.id, 'audioUrl', url);
                }}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 text-xs rounded border',
                  card.audioUrl
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                )}
              >
                <Volume2 className="h-3 w-3" />
                Audio
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Card Button */}
      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={handleAddCard}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Card
      </Button>
    </div>
  );
}
