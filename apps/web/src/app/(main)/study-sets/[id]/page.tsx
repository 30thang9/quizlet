'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, BookOpen, Zap, Brain, FileText, Share2, 
  Edit, Copy, Heart, MoreVertical, User, Clock,
  Plus, Trash2, Eye, MessageCircle, GitBranch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareModal } from '@/features/study/components';
import { TagsInput } from '@/features/tags/components';
import { AskQuizlet } from '@/features/ai/components';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Card {
  id: string;
  term: string;
  definition: string;
}

interface StudySet {
  id: string;
  title: string;
  description: string;
  visibility: 'public' | 'private' | 'link';
  tags: Tag[];
  cards: Card[];
  likeCount: number;
  copyCount: number;
  viewCount: number;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  isLiked: boolean;
  isOwner: boolean;
}

export default function StudySetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAskQuizlet, setShowAskQuizlet] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Demo data
  useEffect(() => {
    setTimeout(() => {
      setStudySet({
        id: params.id as string,
        title: 'Spanish Vocabulary',
        description: 'Basic Spanish words and phrases for beginners',
        visibility: 'public',
        tags: [
          { id: '1', name: 'spanish', color: '#ef4444' },
          { id: '2', name: 'vocabulary', color: '#3b82f6' },
        ],
        cards: [
          { id: '1', term: 'Hello', definition: 'Hola' },
          { id: '2', term: 'Goodbye', definition: 'Adiós' },
          { id: '3', term: 'Thank you', definition: 'Gracias' },
          { id: '4', term: 'Please', definition: 'Por favor' },
          { id: '5', term: 'Yes', definition: 'Sí' },
        ],
        likeCount: 42,
        copyCount: 15,
        viewCount: 234,
        createdAt: '2024-01-15',
        user: {
          name: 'John Doe',
        },
        isLiked: false,
        isOwner: true,
      });
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const handleCopySet = () => {
    // In production, this would call the API
    setStudySet((prev) => prev ? {
      ...prev,
      copyCount: prev.copyCount + 1,
    } : null);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLike = () => {
    setStudySet((prev) => prev ? {
      ...prev,
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    } : null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
      </div>
    );
  }

  if (!studySet) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Study Set Not Found</h2>
        <p className="text-gray-500 mb-4">This set may have been deleted or made private.</p>
        <Button onClick={() => router.push('/library')}>Go to Library</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg mt-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">{studySet.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {studySet.user.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(studySet.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-lg hover:bg-gray-100 ${studySet.isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart className={`w-5 h-5 ${studySet.isLiked ? 'fill-current' : ''}`} />
          </button>
          <Button variant="outline" onClick={() => setShowShareModal(true)}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {studySet.isOwner && (
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {!studySet.isOwner && (
            <Button onClick={handleCopySet}>
              {isCopied ? (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Tags */}
      {studySet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {studySet.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {studySet.description && (
        <p className="text-gray-600 mb-6">{studySet.description}</p>
      )}

      {/* Stats */}
      <div className="flex gap-6 mb-8 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {studySet.viewCount} views
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          {studySet.likeCount} likes
        </span>
        <span className="flex items-center gap-1">
          <Copy className="w-4 h-4" />
          {studySet.copyCount} copies
        </span>
      </div>

      {/* Study Modes */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Study Modes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            onClick={() => router.push(`/study/${studySet.id}?mode=cards`)}
            className="p-4 border border-gray-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-colors text-center"
          >
            <BookOpen className="w-8 h-8 text-sky-500 mx-auto mb-2" />
            <span className="font-medium text-gray-800">Cards</span>
          </button>
          <button
            onClick={() => router.push(`/study/${studySet.id}?mode=match`)}
            className="p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors text-center"
          >
            <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <span className="font-medium text-gray-800">Match</span>
          </button>
          <button
            onClick={() => router.push(`/study/${studySet.id}?mode=learn`)}
            className="p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
          >
            <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <span className="font-medium text-gray-800">Learn</span>
          </button>
          <button
            onClick={() => router.push(`/study/${studySet.id}?mode=test`)}
            className="p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
          >
            <FileText className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <span className="font-medium text-gray-800">Test</span>
          </button>
          <button
            onClick={() => router.push(`/study/${studySet.id}?mode=diagram`)}
            className="p-4 border border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-colors text-center"
          >
            <GitBranch className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <span className="font-medium text-gray-800">Diagram</span>
          </button>
          <button
            onClick={() => setShowAskQuizlet(true)}
            className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <span className="font-medium text-gray-800">Ask AI</span>
          </button>
        </div>
      </div>

      {/* Cards Preview */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Cards ({studySet.cards.length})
          </h2>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        </div>
        <div className="space-y-2">
          {studySet.cards.slice(0, 10).map((card, index) => (
            <div
              key={card.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-400 text-sm w-6">{index + 1}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{card.term}</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-500">{card.definition}</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          ))}
          {studySet.cards.length > 10 && (
            <p className="text-center text-gray-500 py-2">
              +{studySet.cards.length - 10} more cards
            </p>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={studySet.title}
        studySetId={studySet.id}
        currentVisibility={studySet.visibility}
        onVisibilityChange={(visibility) => setStudySet((prev) => prev ? { ...prev, visibility } : null)}
        likeCount={studySet.likeCount}
        copyCount={studySet.copyCount}
        isLiked={studySet.isLiked}
        onLike={handleLike}
      />

      {/* Ask Quizlet Modal */}
      {showAskQuizlet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <AskQuizlet
            context={studySet.cards.map(c => `${c.term}: ${c.definition}`).join('\n')}
            onClose={() => setShowAskQuizlet(false)}
          />
        </div>
      )}
    </div>
  );
}
