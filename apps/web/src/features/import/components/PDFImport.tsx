'use client';

import { useState, useCallback } from 'react';
import { FileText, Upload, Loader2, AlertCircle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParsedCard {
  term: string;
  definition: string;
  selected: boolean;
}

interface PDFImportProps {
  onImport: (cards: { term: string; definition: string }[]) => void;
  onClose: () => void;
}

export function PDFImport({ onImport, onClose }: PDFImportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedCards, setParsedCards] = useState<ParsedCard[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };

  const parseTextToCards = (text: string): ParsedCard[] => {
    // Split by common delimiters: double newlines, numbered lists, etc.
    const lines = text.split(/\n\n+/).filter(line => line.trim());
    const cards: ParsedCard[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip short lines (likely headers, footers, page numbers)
      if (trimmed.length < 10) continue;
      
      // Try to split by common term/definition patterns
      let term = '';
      let definition = '';
      
      // Pattern 1: Tab separated
      if (trimmed.includes('\t')) {
        const parts = trimmed.split('\t');
        term = parts[0]?.trim() || '';
        definition = parts.slice(1).join('\t').trim();
      }
      // Pattern 2: Numbered list (1. Term: Definition)
      else if (/^\d+[.)]\s/.test(trimmed)) {
        const match = trimmed.match(/^\d+[.)]\s*(.+?):\s*(.+)$/);
        if (match) {
          term = match[1].trim();
          definition = match[2].trim();
        }
      }
      // Pattern 3: Term - Definition
      else if (trimmed.includes(' - ')) {
        const parts = trimmed.split(' - ');
        term = parts[0]?.trim() || '';
        definition = parts.slice(1).join(' - ').trim();
      }
      // Pattern 4: Question / Answer pattern
      else if (trimmed.includes('?')) {
        const parts = trimmed.split('?');
        if (parts.length >= 2) {
          term = (parts[0] + '?').trim();
          definition = parts.slice(1).join('?').trim();
        }
      }
      // Pattern 5: Split long text into term/definition by sentence
      else if (trimmed.length > 20) {
        const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim());
        if (sentences.length >= 2) {
          term = sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ').trim();
          definition = sentences.slice(Math.ceil(sentences.length / 2)).join('. ').trim();
        } else {
          // Just use the first sentence as term
          term = sentences[0]?.trim() || '';
          definition = sentences.slice(1).join('. ').trim() || trimmed;
        }
      }
      
      // Only add if both term and definition are valid
      if (term && definition && term.length > 2 && definition.length > 2) {
        cards.push({
          term,
          definition,
          selected: true,
        });
      }
    }
    
    return cards;
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const text = await extractTextFromPDF(file);
      
      if (!text || text.trim().length === 0) {
        setError('No text found in PDF. The PDF might be scanned or image-based.');
        setIsLoading(false);
        return;
      }

      const cards = parseTextToCards(text);
      
      if (cards.length === 0) {
        setError('Could not extract any flashcards from the PDF. Try a different format.');
        setIsLoading(false);
        return;
      }

      setParsedCards(cards);
    } catch (err) {
      console.error('PDF parsing error:', err);
      setError('Failed to parse PDF. Please try a different file.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleCard = (index: number) => {
    setParsedCards(prev =>
      prev.map((card, i) =>
        i === index ? { ...card, selected: !card.selected } : card
      )
    );
  };

  const handleImport = () => {
    const selectedCards = parsedCards
      .filter(card => card.selected)
      .map(card => ({ term: card.term, definition: card.definition }));
    
    if (selectedCards.length === 0) {
      setError('Please select at least one card to import');
      return;
    }

    onImport(selectedCards);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Import from PDF</h2>
              <p className="text-sm text-gray-500">Extract flashcards from PDF documents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!parsedCards.length ? (
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-sky-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    Click to upload a PDF file
                  </p>
                  <p className="text-sm text-gray-400">
                    or drag and drop
                  </p>
                </label>
              </div>

              {/* Format hints */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Supported formats:</h4>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Tab-separated text (Term[TAB]Definition)</li>
                  <li>• Numbered lists (1. Term: Definition)</li>
                  <li>• Term - Definition format</li>
                  <li>• Question/Answer pairs</li>
                </ul>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center justify-center gap-3 p-6">
                  <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                  <span className="text-gray-600">Extracting text from PDF...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center justify-between bg-sky-50 rounded-lg p-4">
                <div>
                  <p className="font-medium text-gray-900">{fileName}</p>
                  <p className="text-sm text-gray-500">
                    {parsedCards.filter(c => c.selected).length} of {parsedCards.length} cards selected
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setParsedCards([])}
                >
                  Choose different file
                </Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Cards List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {parsedCards.map((card, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      card.selected
                        ? 'border-sky-300 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleCard(index)}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      card.selected
                        ? 'bg-sky-500 border-sky-500'
                        : 'border-gray-300'
                    }`}>
                      {card.selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{card.term}</p>
                      <p className="text-sm text-gray-500 truncate">{card.definition}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {parsedCards.length > 0 && (
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={parsedCards.filter(c => c.selected).length === 0}
            >
              Import {parsedCards.filter(c => c.selected).length} Cards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
