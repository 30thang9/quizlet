'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseCSV, exportToCSV, downloadFile, generateExportFilename, readFile, ImportCard } from '@/lib/utils/importExport';
import { Card } from '@/components/study/StudySession';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Card[];
  studySetTitle: string;
  onImport: (cards: ImportCard[]) => void;
}

export function ImportExportModal({ isOpen, onClose, cards, studySetTitle, onImport }: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [importResult, setImportResult] = useState<{
    success: boolean;
    cards: ImportCard[];
    errors: string[];
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    try {
      const content = await readFile(file);
      const result = parseCSV(content);
      setImportResult(result);
    } catch {
      setImportResult({
        success: false,
        cards: [],
        errors: ['Failed to read file'],
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv') || file.type === 'text/plain')) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleImport = () => {
    if (importResult?.cards.length) {
      onImport(importResult.cards);
      setImportResult(null);
      onClose();
    }
  };

  const handleExport = () => {
    const csvContent = exportToCSV(cards);
    const filename = generateExportFilename(studySetTitle);
    downloadFile(csvContent, filename);
  };

  const handleClose = () => {
    setImportResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Import & Export</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => { setActiveTab('import'); setImportResult(null); }}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'import' 
                ? 'text-sky-600 border-b-2 border-sky-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-5 h-5 inline mr-2" />
            Import
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'export' 
                ? 'text-sky-600 border-b-2 border-sky-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Download className="w-5 h-5 inline mr-2" />
            Export
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'import' ? (
            <div className="space-y-4">
              {!importResult ? (
                <>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                      isDragging 
                        ? 'border-sky-500 bg-sky-50' 
                        : 'border-gray-300 hover:border-sky-400 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop your CSV file here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse
                    </p>
                    <Button variant="outline">Choose File</Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv,text/plain"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Supported formats:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• CSV with comma-separated values (term, definition)</li>
                      <li>• Tab-separated values</li>
                      <li>• First row will be skipped if it contains headers</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-medium text-blue-700 mb-2">Example CSV:</h4>
                    <pre className="text-xs text-blue-600 overflow-x-auto">
{`Term,Definition
Hello,Hola
Goodbye,Adiós
Thank you,Gracias`}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {importResult.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
                        <AlertCircle className="w-5 h-5" />
                        {importResult.errors.length} error(s) found
                      </div>
                      <ul className="text-sm text-red-600 space-y-1">
                        {importResult.errors.slice(0, 5).map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li>...and {importResult.errors.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className={`rounded-xl p-4 ${importResult.success ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 font-medium mb-2">
                      {importResult.success ? (
                        <>
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-green-700">
                            {importResult.cards.length} card(s) ready to import
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">
                            No valid cards found
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {importResult.cards.length > 0 && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
                        Preview (first 5 cards)
                      </div>
                      <div className="divide-y">
                        {importResult.cards.slice(0, 5).map((card, i) => (
                          <div key={i} className="p-3 text-sm">
                            <div className="font-medium text-gray-800">{card.term}</div>
                            <div className="text-gray-500">{card.definition}</div>
                          </div>
                        ))}
                        {importResult.cards.length > 5 && (
                          <div className="p-3 text-sm text-gray-500 text-center">
                            ...and {importResult.cards.length - 5} more cards
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={() => setImportResult(null)} variant="outline">
                      Choose Different File
                    </Button>
                    {importResult.cards.length > 0 && (
                      <Button onClick={handleImport}>
                        Import {importResult.cards.length} Cards
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Download className="w-16 h-16 text-sky-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Export Study Set
                </h3>
                <p className="text-gray-600 mb-6">
                  Download your {cards.length} card(s) as a CSV file
                </p>
                <Button onClick={handleExport} disabled={cards.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-700 mb-2">Exported file includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Term column</li>
                  <li>• Definition column</li>
                  <li>• Compatible with Excel, Google Sheets</li>
                  <li>• Can be re-imported to Quizlet Clone</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
