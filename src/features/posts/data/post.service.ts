import apiClient from '../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../infrastructure/api/endpoints';
import type { Post, CreatePostPayload, Comment } from '../domain/types/post.types';

export const fetchFeed = async (page = 1, limit = 10): Promise<Post[]> => {
  const data = await apiClient.get<any, Post[]>(ENDPOINTS.POSTS.FEED, {
    params: { page, limit },
  });
  return data;
};

export const createPost = async (payload: CreatePostPayload): Promise<Post> => {
  const data = await apiClient.post<any, Post>(ENDPOINTS.POSTS.CREATE, payload);
  return data;
};

export const toggleLike = async (postId: string): Promise<{ liked: boolean; likesCount: number }> => {
  const data = await apiClient.post<any, { liked: boolean; likesCount: number }>(
    ENDPOINTS.POSTS.LIKE(postId)
  );
  return data;
};

export const addComment = async (postId: string, text: string): Promise<Comment> => {
  const data = await apiClient.post<any, Comment>(ENDPOINTS.POSTS.COMMENT(postId), { text });
  return data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await apiClient.delete(ENDPOINTS.POSTS.DELETE(postId));
};
