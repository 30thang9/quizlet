'use client';

import { useState, useCallback, useRef } from 'react';
import { Plus, Trash2, Move, Save, X } from 'lucide-react';

interface DiagramLabel {
  id?: string;
  xPosition: number;
  yPosition: number;
  term: string;
  definition: string;
  hint?: string;
}

interface DiagramCreatorProps {
  initialData?: {
    title: string;
    description?: string;
    imageUrl: string;
    labels?: DiagramLabel[];
  };
  onSave: (data: { title: string; description?: string; imageUrl: string; labels: DiagramLabel[] }) => Promise<void>;
  onCancel: () => void;
}

export function DiagramCreator({ initialData, onSave, onCancel }: DiagramCreatorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [labels, setLabels] = useState<DiagramLabel[]>(initialData?.labels || []);
  const [selectedLabel, setSelectedLabel] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current || !imageUrl) return;

      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const newLabel: DiagramLabel = {
        xPosition: Math.round(x * 100) / 100,
        yPosition: Math.round(y * 100) / 100,
        term: '',
        definition: '',
        hint: '',
      };

      setLabels((prev) => [...prev, newLabel]);
      setSelectedLabel(labels.length);
    },
    [imageUrl, labels.length],
  );

  const handleLabelMove = useCallback(
    (index: number, x: number, y: number) => {
      setLabels((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          xPosition: Math.round(x * 100) / 100,
          yPosition: Math.round(y * 100) / 100,
        };
        return updated;
      });
    },
    [],
  );

  const handleLabelDrag = useCallback(
    (index: number, e: React.MouseEvent) => {
      if (!imageRef.current) return;

      const startX = e.clientX;
      const startY = e.clientY;
      const startLabel = labels[index];

      setIsDragging(true);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const rect = imageRef.current!.getBoundingClientRect();
        const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
        handleLabelMove(index, x, y);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [labels, handleLabelMove],
  );

  const updateLabel = useCallback((index: number, field: keyof DiagramLabel, value: string) => {
    setLabels((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const deleteLabel = useCallback((index: number) => {
    setLabels((prev) => prev.filter((_, i) => i !== index));
    setSelectedLabel(null);
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !imageUrl) return;

    setIsSaving(true);
    try {
      await onSave({ title, description, imageUrl, labels });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Image Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Diagram</h2>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !imageUrl || isSaving}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Diagram'}
            </button>
          </div>
        </div>

        {/* Upload Area */}
        {!imageUrl && (
          <label className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Plus className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">Click to upload image</p>
            <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
          </label>
        )}

        {/* Image with Labels */}
        {imageUrl && (
          <div className="flex-1 flex flex-col">
            <div
              ref={imageRef}
              className="relative flex-1 bg-gray-100 rounded-xl overflow-hidden cursor-crosshair"
              onClick={handleImageClick}
            >
              <img
                src={imageUrl}
                alt="Diagram"
                className="w-full h-full object-contain"
                draggable={false}
              />

              {/* Labels */}
              {labels.map((label, index) => (
                <div
                  key={index}
                  className={`absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 cursor-move transition-transform ${
                    selectedLabel === index
                      ? 'border-orange-500 bg-orange-100 scale-125'
                      : 'border-blue-500 bg-blue-100 hover:scale-110'
                  }`}
                  style={{ left: `${label.xPosition}%`, top: `${label.yPosition}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLabel(index);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleLabelDrag(index, e);
                  }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 bg-white px-1 rounded">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-2 text-center">
              Click on image to add labels • Drag labels to reposition
            </p>
          </div>
        )}
      </div>

      {/* Labels Editor */}
      <div className="w-80 bg-white border rounded-xl p-4 flex flex-col">
        <h3 className="font-semibold mb-4">Diagram Details</h3>

        {/* Title & Description */}
        <div className="space-y-3 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Diagram title"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
        </div>

        <div className="border-t my-4" />

        <h3 className="font-semibold mb-4">
          Labels ({labels.length})
        </h3>

        <div className="flex-1 overflow-y-auto space-y-4">
          {labels.map((label, index) => (
            <div
              key={index}
              className={`p-3 border rounded-lg ${
                selectedLabel === index ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Label {index + 1}</span>
                <button
                  onClick={() => deleteLabel(index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                value={label.term}
                onChange={(e) => updateLabel(index, 'term', e.target.value)}
                placeholder="Term"
                className="w-full px-2 py-1 border rounded mb-2 text-sm"
              />
              <textarea
                value={label.definition}
                onChange={(e) => updateLabel(index, 'definition', e.target.value)}
                placeholder="Definition"
                rows={2}
                className="w-full px-2 py-1 border rounded mb-2 text-sm resize-none"
              />
              <input
                type="text"
                value={label.hint || ''}
                onChange={(e) => updateLabel(index, 'hint', e.target.value)}
                placeholder="Hint (optional)"
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          ))}

          {labels.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">
              Click on the image to add labels
            </p>
          )}
        </div>

        {imageUrl && (
          <button
            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
            className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Change Image
          </button>
        )}
      </div>
    </div>
  );
}
