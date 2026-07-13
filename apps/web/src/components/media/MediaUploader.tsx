'use client';

import React, { useState, useCallback } from 'react';

interface MediaUploaderProps {
  folder?: string;
  onUploadSuccess?: (url: string, key: string) => void;
  onUploadError?: (error: string) => void;
  maxSize?: number;
  allowedTypes?: string[];
}

export function MediaUploader({
  folder = 'cards',
  onUploadSuccess,
  onUploadError,
  maxSize = 10 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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
    if (!allowedTypes.includes(file.type)) {
      return `Invalid type. Allowed: ${allowedTypes.join(', ')}`;
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
    try {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }

      const response = await fetch('/api/v1/media/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ fileName: file.name, mimeType: file.type, folder }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to get upload URL');

      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      const publicUrl = data.uploadUrl.split('?')[0];
      onUploadSuccess?.(publicUrl, data.key);
    } catch (error: any) {
      onUploadError?.(error.message || 'Upload failed');
      setPreview(null);
    } finally {
      setUploading(false);
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

  return (
    <div className="media-uploader">
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <button type="button" className="remove-btn" onClick={() => setPreview(null)}>
              Remove
            </button>
          </div>
        ) : (
          <>
            <svg className="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17,8 12,3 7,8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="upload-text">Drag & drop or click to upload</p>
            <p className="upload-hint">Max: {maxSize / 1024 / 1024}MB</p>
            <input type="file" className="file-input" accept={allowedTypes.join(',')} onChange={handleChange} disabled={uploading} />
          </>
        )}
        {uploading && <div className="upload-progress"><div className="spinner" /><p>Uploading...</p></div>}
      </div>
    </div>
  );
}

export default MediaUploader;
