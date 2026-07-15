'use client';

import { useState, useCallback } from 'react';
import { X, Upload, FileText, AlertCircle, Check, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { parseCSV, readFile, type ImportCard } from '@/shared/utils';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (cards: ImportCard[]) => void;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportCard[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setIsLoading(true);
    setErrors([]);
    setPreview([]);

    try {
      const content = await readFile(selectedFile);
      const result = parseCSV(content);
      
      if (result.errors.length > 0) {
        setErrors(result.errors.slice(0, 5));
      }
      
      setPreview(result.cards.slice(0, 10));
    } catch (error) {
      setErrors(['Failed to read file']);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      if (['csv', 'txt', 'tsv'].includes(ext || '')) {
        handleFile(droppedFile);
      } else {
        setErrors(['Please upload a CSV, TXT, or TSV file']);
      }
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  }, [handleFile]);

  const handleImport = useCallback(async () => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      const content = await readFile(file);
      const result = parseCSV(content);
      onImport(result.cards);
      onClose();
      resetState();
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [file, onImport, onClose]);

  const resetState = () => {
    setFile(null);
    setPreview([]);
    setErrors([]);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Import Cards</h2>
            <p className="text-sm text-gray-500 mt-1">CSV, TXT, or TSV format</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-auto">
          {!file ? (
            <>
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="mb-4">
                  {isDragging ? (
                    <FileText className="w-12 h-12 text-sky-500 mx-auto" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  )}
                </div>
                <p className="text-gray-600 mb-2">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  or
                </p>
                <label className="inline-block">
                  <span className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 cursor-pointer">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    accept=".csv,.txt,.tsv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Format Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Supported Formats:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CSV: Term,Definition (comma separated)</li>
                  <li>• TSV: Term (tab) Definition (tab separated)</li>
                  <li>• TXT: Term (tab) Definition (one per line)</li>
                </ul>
                <div className="mt-3 p-3 bg-white rounded border">
                  <p className="text-xs text-gray-500 mb-1">Example:</p>
                  <code className="text-xs text-gray-700">
                    Vocabulary,Definition{'\n'}
                    photosynthesis,Process by which plants convert sunlight{'\n'}
                    mitochondria,Powerhouse of the cell
                  </code>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* File Info */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                <FileSpreadsheet className="w-8 h-8 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={resetState}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-red-700">Import warnings:</span>
                  </div>
                  <ul className="text-sm text-red-600 space-y-1">
                    {errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                    {errors.length === 5 && (
                      <li>• ...and more (check file for details)</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Preview */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Preview ({preview.length} of {preview.length > 10 ? '10+' : preview.length})
                  </span>
                  {preview.length > 10 && (
                    <span className="text-xs text-gray-500">
                      Showing first 10 cards
                    </span>
                  )}
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">#</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Term</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Definition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {preview.map((card, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                          <td className="px-3 py-2 text-gray-900 truncate max-w-[150px]">
                            {card.term}
                          </td>
                          <td className="px-3 py-2 text-gray-700 truncate max-w-[200px]">
                            {card.definition}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl flex-shrink-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {file && (
            <Button
              onClick={handleImport}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Import Cards
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
