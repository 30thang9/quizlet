'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Mic, Image as ImageIcon, Upload, X, Loader2, FileAudio } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';

type MediaType = 'image' | 'audio' | 'all';

interface MediaUploaderProps {
  type?: MediaType;
  folder?: string;
  onUploadSuccess?: (url: string, key: string, type: 'image' | 'audio') => void;
  onUploadError?: (error: string) => void;
  maxSize?: number;
  preview?: string | null;
  onRemove?: () => void;
}

export function MediaUploader({
  type = 'all',
  folder = 'cards',
  onUploadSuccess,
  onUploadError,
  maxSize = 10 * 1024 * 1024,
  preview,
  onRemove,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(preview || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];
  
  const getAllowedTypes = () => {
    if (type === 'image') return allowedImageTypes;
    if (type === 'audio') return allowedAudioTypes;
    return [...allowedImageTypes, ...allowedAudioTypes];
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File too large. Maximum: ${maxSize / 1024 / 1024}MB`;
    }
    const allowed = getAllowedTypes();
    if (!allowed.includes(file.type)) {
      return `Invalid type. Allowed: ${allowed.map(t => t.split('/')[1]).join(', ')}`;
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      onUploadError?.(error);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const isAudio = file.type.startsWith('audio/');
      
      if (isAudio) {
        // For audio, create local preview URL (in production, would upload to S3)
        const audioUrl = URL.createObjectURL(file);
        setImagePreview(audioUrl);
        
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 20) {
          setUploadProgress(i);
          await new Promise(r => setTimeout(r, 100));
        }
        
        onUploadSuccess?.(audioUrl, `local-${Date.now()}`, 'audio');
      } else {
        // For images, read and preview locally
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
        };
        reader.readAsDataURL(file);

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 20) {
          setUploadProgress(i);
          await new Promise(r => setTimeout(r, 100));
        }

        // Mock success - in production would upload to S3
        onUploadSuccess?.(`mock://${file.name}`, `local-${Date.now()}`, 'image');
      }
    } catch (error: any) {
      onUploadError?.(error.message || 'Upload failed');
      setImagePreview(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
  }, [folder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleUpload(e.target.files[0]);
  };

  const handleRemove = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  const isAudioPreview = imagePreview?.startsWith('blob:') || imagePreview?.startsWith('mock:') || !imagePreview?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  // Show preview if exists
  if (imagePreview) {
    return (
      <div className="relative">
        <div className="rounded-lg overflow-hidden border border-gray-200">
          {isAudioPreview ? (
            <div className="p-4 bg-gray-50">
              <AudioPlayer src={imagePreview} />
            </div>
          ) : (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-32 object-cover" 
            />
          )}
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="media-uploader">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={getAllowedTypes().join(',')}
        onChange={handleChange}
        disabled={uploading}
      />
      
      <div
        className={`upload-zone border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-sky-400 bg-sky-50' 
            : 'border-gray-300 hover:border-sky-400 hover:bg-sky-50'
        } ${uploading ? 'pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 text-sky-500 mx-auto animate-spin" />
            <p className="text-sm text-gray-600">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-sky-500 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {type === 'audio' ? (
              <Mic className="w-10 h-10 text-gray-400 mx-auto" />
            ) : type === 'image' ? (
              <ImageIcon className="w-10 h-10 text-gray-400 mx-auto" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <span className="text-gray-300">|</span>
                <Mic className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <p className="text-sm text-gray-600 font-medium">
              {type === 'audio' ? 'Add audio' : type === 'image' ? 'Add image' : 'Add media'}
            </p>
            <p className="text-xs text-gray-400">
              Click or drag & drop • Max {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaUploader;
