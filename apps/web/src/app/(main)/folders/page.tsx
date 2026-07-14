'use client';

import { useState } from 'react';
import { Plus, Folder, MoreVertical, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

// Demo folders
const initialFolders = [
  {
    id: '1',
    name: 'Spanish',
    color: 'sky',
    studySetCount: 3,
    totalCards: 45,
  },
  {
    id: '2',
    name: 'Biology',
    color: 'green',
    studySetCount: 5,
    totalCards: 120,
  },
  {
    id: '3',
    name: 'History',
    color: 'amber',
    studySetCount: 2,
    totalCards: 60,
  },
];

const colorOptions = [
  { name: 'Sky', value: 'sky', bg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-300' },
  { name: 'Green', value: 'green', bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
  { name: 'Amber', value: 'amber', bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-300' },
  { name: 'Red', value: 'red', bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-300' },
  { name: 'Purple', value: 'purple', bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' },
  { name: 'Pink', value: 'pink', bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-300' },
];

export default function FoldersPage() {
  const [folders, setFolders] = useState(initialFolders);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('sky');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      color: selectedColor,
      studySetCount: 0,
      totalCards: 0,
    };

    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setSelectedColor('sky');
    setIsCreating(false);
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm('Are you sure you want to delete this folder?')) {
      setFolders(folders.filter((f) => f.id !== id));
    }
  };

  const handleStartEdit = (folder: typeof initialFolders[0]) => {
    setEditingId(folder.id);
    setEditName(folder.name);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;

    setFolders(
      folders.map((f) =>
        f.id === editingId ? { ...f, name: editName.trim() } : f
      )
    );
    setEditingId(null);
    setEditName('');
  };

  const getColorClasses = (color: string) => {
    return colorOptions.find((c) => c.value === color) || colorOptions[0];
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Folders</h1>
          <p className="text-gray-500">Organize your study sets into folders</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Folder
        </Button>
      </div>

      {/* Create Folder Form */}
      {isCreating && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Create New Folder</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g., Spanish, Biology"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-10 h-10 rounded-full ${color.bg} border-2 ${
                      selectedColor === color.value ? color.border : 'border-transparent'
                    } transition-all`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleCreateFolder}>Create Folder</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Folders Grid */}
      {folders.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No folders yet</h3>
          <p className="text-gray-500 mb-6">Create your first folder to organize your study sets</p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => {
            const colors = getColorClasses(folder.color);
            return (
              <div
                key={folder.id}
                className={`${colors.bg} border ${colors.border} rounded-2xl p-6 hover:shadow-md transition-shadow`}
              >
                {editingId === folder.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${colors.text}`}>
                        <Folder className="w-8 h-8" />
                      </div>
                      <div className="relative group">
                        <button className="p-1 text-gray-500 hover:text-gray-700">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-10 min-w-32">
                          <button
                            onClick={() => handleStartEdit(folder)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Rename
                          </button>
                          <button
                            onClick={() => handleDeleteFolder(folder.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{folder.name}</h3>
                    <p className="text-sm text-gray-600">
                      {folder.studySetCount} study set{folder.studySetCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-gray-500">
                      {folder.totalCards} cards total
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
