'use client';

import { useState, useRef, useCallback } from 'react';
import { Mic, Upload, X, Loader2, AlertCircle, Check, FileAudio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioPlayer } from './AudioPlayer';

interface AudioUploaderProps {
  onUpload: (audioUrl: string) => void;
  onRemove?: () => void;
  currentAudio?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export function AudioUploader({
  onUpload,
  onRemove,
  currentAudio,
  accept = 'audio/*',
  maxSize = 10,
}: AudioUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(currentAudio || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Create a local URL for preview (in production, this would be an API call)
      const audioUrl = URL.createObjectURL(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setUploadedAudio(audioUrl);
      onUpload(audioUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload audio. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [maxSize, onUpload]);

  const handleRemove = () => {
    if (uploadedAudio && uploadedAudio.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedAudio);
    }
    setUploadedAudio(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (uploadedAudio) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <FileAudio className="w-5 h-5 text-sky-500" />
          <span className="text-sm text-gray-600 flex-1 truncate">Audio attached</span>
          <button
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <AudioPlayer src={uploadedAudio} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {isUploading ? (
        <div className="border-2 border-dashed border-sky-300 rounded-xl p-6 text-center bg-sky-50">
          <Loader2 className="w-8 h-8 text-sky-500 mx-auto mb-3 animate-spin" />
          <p className="text-sm text-gray-600 mb-2">Uploading audio...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={openFileDialog}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-sky-400 hover:bg-sky-50 transition-colors"
        >
          <Mic className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium mb-1">
            Add audio
          </p>
          <p className="text-xs text-gray-400">
            MP3, WAV, OGG up to {maxSize}MB
          </p>
        </button>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
