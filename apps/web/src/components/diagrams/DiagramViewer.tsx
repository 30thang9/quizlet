'use client';

import { useState, memo } from 'react';
import { Copy, Eye, Edit2 } from 'lucide-react';

interface DiagramLabel {
  id: string;
  xPosition: number;
  yPosition: number;
  term: string;
  definition: string;
  hint?: string;
}

interface DiagramViewerProps {
  diagram: {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    viewCount: number;
    copyCount: number;
    user?: { name: string };
  };
  labels: DiagramLabel[];
  onCopy?: () => void;
  onEdit?: () => void;
  showLabels?: boolean;
}

export const DiagramViewer = memo(function DiagramViewer({
  diagram,
  labels,
  onCopy,
  onEdit,
  showLabels = true,
}: DiagramViewerProps) {
  const [hoveredLabel, setHoveredLabel] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<number | null>(null);
  const [showAllLabels, setShowAllLabels] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{diagram.title}</h1>
          {diagram.description && (
            <p className="text-gray-600 mt-1">{diagram.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {diagram.viewCount} views
            </span>
            <span className="flex items-center gap-1">
              <Copy className="w-4 h-4" />
              {diagram.copyCount} copies
            </span>
          </div>

          <div className="flex gap-2">
            {onCopy && (
              <button
                onClick={onCopy}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image with Labels */}
      <div className="relative flex-1 bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={diagram.imageUrl}
          alt={diagram.title}
          className="w-full h-full object-contain"
        />

        {/* Labels */}
        {showLabels && labels.map((label, index) => (
          <div
            key={label.id || index}
            className={`absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all ${
              selectedLabel === index || hoveredLabel === index
                ? 'bg-orange-500 scale-125 z-20'
                : 'bg-blue-500 hover:scale-110 z-10'
            }`}
            style={{ left: `${label.xPosition}%`, top: `${label.yPosition}%` }}
            onMouseEnter={() => setHoveredLabel(index)}
            onMouseLeave={() => setHoveredLabel(null)}
            onClick={() => setSelectedLabel(selectedLabel === index ? null : index)}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-blue-500 px-1 rounded whitespace-nowrap">
              {index + 1}
            </span>
          </div>
        ))}

        {/* Label Tooltip */}
        {hoveredLabel !== null && labels[hoveredLabel] && (
          <div
            className="absolute z-30 bg-white shadow-lg rounded-lg p-3 max-w-xs"
            style={{
              left: `${labels[hoveredLabel].xPosition}%`,
              top: `${Math.min(labels[hoveredLabel].yPosition + 8, 70)}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <h4 className="font-semibold text-blue-600">{labels[hoveredLabel].term}</h4>
            <p className="text-sm text-gray-600 mt-1">{labels[hoveredLabel].definition}</p>
          </div>
        )}
      </div>

      {/* Selected Label Details */}
      {selectedLabel !== null && labels[selectedLabel] && (
        <div className="mt-4 bg-white border rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-sm text-gray-500">Label {selectedLabel + 1}</span>
              <h3 className="font-semibold text-lg">{labels[selectedLabel].term}</h3>
              <p className="text-gray-600 mt-2">{labels[selectedLabel].definition}</p>
              {labels[selectedLabel].hint && (
                <p className="text-sm text-gray-400 mt-2 italic">
                  💡 Hint: {labels[selectedLabel].hint}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedLabel(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Labels List */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Labels ({labels.length})</h3>
          <button
            onClick={() => setShowAllLabels(!showAllLabels)}
            className="text-sm text-orange-500 hover:text-orange-600"
          >
            {showAllLabels ? 'Hide all' : 'Show all'}
          </button>
        </div>

        <div className={`grid gap-2 ${showAllLabels ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
          {labels.map((label, index) => (
            <div
              key={label.id || index}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedLabel === index
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedLabel(selectedLabel === index ? null : index)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="font-medium text-sm truncate">{label.term}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{label.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
