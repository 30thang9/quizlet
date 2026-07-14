'use client';

import { useState } from 'react';
import { X, Link, Globe, Lock, Users, Copy, Check, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

type Visibility = 'public' | 'private' | 'link';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  studySetId: string;
  currentVisibility: Visibility;
  onVisibilityChange: (visibility: Visibility) => void;
  likeCount: number;
  copyCount: number;
  isLiked: boolean;
  onLike: () => void;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  studySetId,
  currentVisibility,
  onVisibilityChange,
  likeCount,
  copyCount,
  isLiked,
  onLike,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/study/${studySetId}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'twitter' | 'facebook') => {
    const text = `Check out "${title}" on Quizlet Clone!`;
    const url = shareUrl;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  if (!isOpen) return null;

  const visibilityOptions = [
    {
      value: 'public' as Visibility,
      label: 'Public',
      description: 'Anyone can find and study this set',
      icon: Globe,
      color: 'text-green-600',
    },
    {
      value: 'private' as Visibility,
      label: 'Private',
      description: 'Only you can see this set',
      icon: Lock,
      color: 'text-gray-600',
    },
    {
      value: 'link' as Visibility,
      label: 'Link Only',
      description: 'Anyone with the link can study',
      icon: Link,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Share & Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Visibility */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Who can see this set?</h3>
            <div className="space-y-2">
              {visibilityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onVisibilityChange(option.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    currentVisibility === option.value
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <option.icon className={`w-5 h-5 ${option.color}`} />
                    <div>
                      <div className="font-medium text-gray-800">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Share link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Share */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Share on social media</h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
                Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                Facebook
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 pt-4 border-t">
            <button
              onClick={onLike}
              className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
              <span className="font-medium">{likeCount}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-5 h-5" />
              <span className="font-medium">{copyCount} copies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
