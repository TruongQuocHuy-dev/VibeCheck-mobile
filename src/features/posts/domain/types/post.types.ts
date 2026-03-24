/**
 * Domain types for the Posts/Feed feature.
 */

export interface PostUser {
  _id: string;
  displayName: string;
  avatar: string | null;
  vibes: string[];
}

export interface Comment {
  _id: string;
  user: PostUser;
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  user: PostUser;
  content: string;
  media: string | null;
  vibe: string | null;
  likes: string[];       // Array of user IDs
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostPayload {
  content: string;
  media?: string;
  vibe?: string;
}
