'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Heart, MessageCircle, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommentUser {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  user: CommentUser;
  likeCount: number;
  isEdited: boolean;
  createdAt: string;
}

interface CommentsProps {
  studySetId: string;
  currentUserId?: string;
}

const DEMO_USER: CommentUser = {
  id: 'demo-user',
  name: 'Demo User',
  username: 'demo_user',
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const CommentsComponent = ({ studySetId, currentUserId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const userId = currentUserId || DEMO_USER.id;

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/v1/study-sets/${studySetId}/comments`);
        const data = await response.json();
        setComments(data.data || []);
      } catch {
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [studySetId]);

  // Memoized handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/study-sets/${studySetId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: newComment }),
      });
      const data = await response.json();
      if (data.success) {
        setComments((prev) => [data.data, ...prev]);
        setNewComment('');
      }
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  }, [newComment, studySetId, userId]);

  const handleEdit = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`/api/v1/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: editContent }),
      });
      const data = await response.json();
      if (data.success) {
        setComments((prev) => prev.map((c) => c.id === commentId ? data.data : c));
        setEditingId(null);
        setEditContent('');
      }
    } catch {
      // Handle error
    }
  }, [editContent, userId]);

  const handleDelete = useCallback(async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/v1/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch {
      // Handle error
    }
  }, [userId]);

  const handleLike = useCallback(async (commentId: string) => {
    try {
      const response = await fetch(`/api/v1/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        setComments((prev) =>
          prev.map((c) => c.id === commentId ? { ...c, likeCount: data.data.likeCount } : c)
        );
      }
    } catch {
      // Handle error
    }
  }, [userId]);

  const handleStartEdit = useCallback((comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditContent('');
  }, []);

  const isSubmitDisabled = !newComment.trim() || isSubmitting;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-bold text-gray-800">
          Comments ({comments.length})
        </h2>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
          rows={3}
          aria-label="Write a comment"
        />
        <div className="flex justify-end mt-2">
          <Button type="submit" disabled={isSubmitDisabled}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-500" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="group">
              {editingId === comment.id ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    rows={2}
                    autoFocus
                    aria-label="Edit comment"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleEdit(comment.id)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-medium text-gray-800">
                            {comment.user.name}
                          </span>
                          <span className="text-gray-400 text-sm ml-2">
                            @{comment.user.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.isEdited && (
                            <span className="text-xs text-gray-400">(edited)</span>
                          )}
                          {comment.userId === userId && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleStartEdit(comment)}
                                className="p-1 hover:bg-gray-200 rounded"
                                aria-label="Edit comment"
                              >
                                <Edit2 className="w-4 h-4 text-gray-500" />
                              </button>
                              <button
                                onClick={() => handleDelete(comment.id)}
                                className="p-1 hover:bg-red-100 rounded"
                                aria-label="Delete comment"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center gap-1 mt-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      aria-label="Like comment"
                    >
                      <Heart className="w-4 h-4" />
                      {comment.likeCount > 0 && comment.likeCount}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Comments = memo(CommentsComponent);
