'use client';

import { useState } from 'react';
import { X, Download, FileText, FileJson, FileSpreadsheet, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { exportStudySet, type ExportFormat } from '@/lib/utils/importExport';

interface Card {
  id: string;
  front: string;
  back: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Card[];
  title: string;
}

const exportFormats: { format: ExportFormat; label: string; icon: React.ReactNode; description: string }[] = [
  {
    format: 'csv',
    label: 'CSV',
    icon: <FileSpreadsheet className="w-6 h-6" />,
    description: 'Spreadsheet compatible, great for Excel & Google Sheets',
  },
  {
    format: 'json',
    label: 'JSON',
    icon: <FileJson className="w-6 h-6" />,
    description: 'Machine readable, ideal for developers',
  },
  {
    format: 'anki',
    label: 'Anki',
    icon: <FileText className="w-6 h-6" />,
    description: 'Import directly into Anki flashcard app',
  },
  {
    format: 'txt',
    label: 'Plain Text',
    icon: <FileText className="w-6 h-6" />,
    description: 'Simple text format, universal compatibility',
  },
];

export function ExportModal({ isOpen, onClose, cards, title }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const exportCards = cards.map(card => ({
        term: card.front,
        definition: card.back,
      }));
      
      exportStudySet(exportCards, title, selectedFormat);
      setExportSuccess(true);
      
      setTimeout(() => {
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export Study Set</h2>
            <p className="text-sm text-gray-500 mt-1">{cards.length} cards</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Choose a format to export your study set:
          </p>

          <div className="grid grid-cols-2 gap-3">
            {exportFormats.map((item) => (
              <button
                key={item.format}
                onClick={() => setSelectedFormat(item.format)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  selectedFormat === item.format
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {selectedFormat === item.format && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-sky-500" />
                  </div>
                )}
                <div className={`mb-2 ${
                  selectedFormat === item.format ? 'text-sky-500' : 'text-gray-600'
                }`}>
                  {item.icon}
                </div>
                <div className={`font-semibold ${
                  selectedFormat === item.format ? 'text-sky-700' : 'text-gray-900'
                }`}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="min-w-32"
          >
            {isExporting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Exporting...
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Exported!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
