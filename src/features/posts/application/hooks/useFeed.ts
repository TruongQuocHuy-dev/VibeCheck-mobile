import { useState, useEffect, useCallback } from 'react';
import { fetchFeed, toggleLike, addComment, createPost } from '../../data/post.service';
import type { Post, Comment } from '../../domain/types/post.types';

interface UseFeed {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  currentUserId: string | null;
  handleLike: (postId: string) => Promise<void>;
  handleComment: (postId: string, text: string) => Promise<void>;
  handleCreatePost: (content: string, vibe?: string) => Promise<void>;
  handleRefresh: () => void;
  handleLoadMore: () => void;
}

export const useFeed = (currentUserId: string | null): UseFeed => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadFeed = useCallback(async (pageNum = 1, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else if (pageNum === 1) setLoading(true);

    setError(null);
    try {
      const data = await fetchFeed(pageNum);
      setPosts((prev) => (pageNum === 1 ? data : [...prev, ...data]));
    } catch (err: any) {
      setError(err?.message ?? 'Không tải được feed.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFeed(1);
  }, [loadFeed]);

  const handleLike = useCallback(async (postId: string) => {
    try {
      const result = await toggleLike(postId);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          const newLikes = result.liked
            ? [...p.likes, currentUserId ?? '_opt']
            : p.likes.filter((uid) => uid !== currentUserId);
          return { ...p, likes: newLikes };
        })
      );
    } catch {
      // Silent fail: user will see no change (optimistic already not applied)
    }
  }, [currentUserId]);

  const handleComment = useCallback(async (postId: string, text: string) => {
    const newComment = await addComment(postId, text);
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, comments: [...p.comments, newComment as Comment] }
          : p
      )
    );
  }, []);

  const handleCreatePost = useCallback(async (content: string, vibe?: string) => {
    const newPost = await createPost({ content, vibe });
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const handleRefresh = useCallback(() => {
    setPage(1);
    loadFeed(1, true);
  }, [loadFeed]);

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadFeed(nextPage);
  }, [page, loadFeed]);

  return {
    posts,
    loading,
    refreshing,
    error,
    currentUserId,
    handleLike,
    handleComment,
    handleCreatePost,
    handleRefresh,
    handleLoadMore,
  };
};
