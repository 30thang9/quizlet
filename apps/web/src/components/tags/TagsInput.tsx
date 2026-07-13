'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { X, Plus, Search } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagsInputProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
  suggestions?: Tag[];
  placeholder?: string;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#6366f1', '#8b5cf6',
  '#ec4899', '#64748b',
];

export function TagsInput({ tags, onChange, suggestions = [], placeholder = 'Add tags...' }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.some((t) => t.name === s.name)
  );

  const addTag = (name: string, color?: string) => {
    const trimmedName = name.trim().toLowerCase();
    if (!trimmedName || tags.some((t) => t.name === trimmedName)) return;

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: trimmedName,
      color: color || selectedColor,
    };

    onChange([...tags, newTag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (id: string) => {
    onChange(tags.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1].id);
    } else if (e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) addTag(inputValue);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="flex flex-wrap items-center gap-2 p-3 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-transparent"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm"
            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
          >
            {tag.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag.id);
              }}
              className="hover:opacity-70"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-24 outline-none text-sm"
        />
      </div>

      {/* Color picker */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Color:</span>
        <div className="flex gap-1">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-5 h-5 rounded-full transition-transform ${
                selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (inputValue || filteredSuggestions.length > 0) && (
        <div className="relative">
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {inputValue && !filteredSuggestions.some((s) => s.name === inputValue.toLowerCase()) && (
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-gray-400" />
                Create "{inputValue}"
              </button>
            )}
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => addTag(suggestion.name, suggestion.color)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: suggestion.color }}
                />
                {suggestion.name}
              </button>
            ))}
            {filteredSuggestions.length === 0 && !inputValue && (
              <p className="px-4 py-2 text-gray-500 text-sm">
                Type to search or create tags
              </p>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
}
