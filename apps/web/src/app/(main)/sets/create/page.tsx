'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft, GripVertical, Image, Mic, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImportExportModal } from '@/components/study';
import { ImportCard } from '@/lib/utils/importExport';

interface Card {
  id: string;
  term: string;
  definition: string;
}

export default function CreateStudySetPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<Card[]>([
    { id: '1', term: '', definition: '' },
    { id: '2', term: '', definition: '' },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  const addCard = () => {
    setCards([
      ...cards,
      { id: Date.now().toString(), term: '', definition: '' },
    ]);
  };

  const removeCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter((card) => card.id !== id));
    }
  };

  const updateCard = (id: string, field: 'term' | 'definition', value: string) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const handleImport = (importedCards: ImportCard[]) => {
    const newCards = importedCards.map((card, i) => ({
      id: `imported-${Date.now()}-${i}`,
      term: card.term,
      definition: card.definition,
    }));
    setCards([...cards, ...newCards]);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your study set');
      return;
    }

    const validCards = cards.filter((card) => card.term.trim() && card.definition.trim());
    if (validCards.length === 0) {
      alert('Please add at least one card with both term and definition');
      return;
    }

    setIsSaving(true);
    
    // In production, this would call the API
    console.log('Saving study set:', { title, description, cards: validCards });
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      router.push('/library');
    }, 1000);
  };

  const validCardsCount = cards.filter((c) => c.term.trim() && c.definition.trim()).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowImportExport(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Study Set Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Study Set</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Spanish Vocabulary, Biology Chapter 5"
              className="text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description to help you remember what this set covers..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Cards</h2>
            <p className="text-sm text-gray-500">
              {validCardsCount} of {cards.length} cards with content
            </p>
          </div>
          <Button variant="outline" onClick={addCard}>
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        </div>

        {/* Card Headers */}
        <div className="grid grid-cols-12 gap-4 mb-2 px-4">
          <div className="col-span-1"></div>
          <div className="col-span-5 text-sm font-medium text-gray-600">Term</div>
          <div className="col-span-5 text-sm font-medium text-gray-600">Definition</div>
          <div className="col-span-1"></div>
        </div>

        {/* Card List */}
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="col-span-1 flex items-center justify-center text-gray-400">
                <GripVertical className="w-5 h-5 cursor-grab" />
              </div>
              <div className="col-span-5">
                <textarea
                  value={card.term}
                  onChange={(e) => updateCard(card.id, 'term', e.target.value)}
                  placeholder="Term"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  rows={2}
                />
                <div className="flex gap-2 mt-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600" title="Add image">
                    <Image className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600" title="Add audio">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="col-span-5">
                <textarea
                  value={card.definition}
                  onChange={(e) => updateCard(card.id, 'definition', e.target.value)}
                  placeholder="Definition"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => removeCard(card.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete card"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add More Button */}
        <button
          onClick={addCard}
          className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-sky-500 hover:text-sky-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add another card
        </button>

        {/* Import/Export */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex gap-4">
            <button
              onClick={() => setShowImportExport(true)}
              className="flex items-center gap-2 px-4 py-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import from CSV
            </button>
            {cards.length > 0 && (
              <button
                onClick={() => setShowImportExport(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export to CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <h3 className="font-semibold text-blue-800 mb-2">Tips for creating effective flashcards:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep terms and definitions concise</li>
          <li>• Use one concept per card</li>
          <li>• Add images to help visual learners</li>
          <li>• Create your own cards for better retention</li>
        </ul>
      </div>

      {/* Import/Export Modal */}
      <ImportExportModal
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
        cards={cards.map((c) => ({ id: c.id, term: c.term, definition: c.definition }))}
        studySetTitle={title || 'Study Set'}
        onImport={handleImport}
      />
    </div>
  );
}
