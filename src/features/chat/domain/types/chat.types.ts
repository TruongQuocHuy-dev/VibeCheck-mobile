/**
 * Interface representing a single chat item in the Inbox list (legacy/mock).
 */
export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
}

/**
 * Minimal user info embedded inside conversations/messages.
 */
export interface ChatUser {
  _id: string;
  displayName: string;
  fullName: string;
  avatar: string | null;
  bio?: string | null;
  isOnline?: boolean;
  lastActive?: string | null;
}

/**
 * Real conversation from backend — represents a matched chat.
 */
export interface ConversationItem {
  id: string;
  user: ChatUser;
  lastMessage: string;
  lastMessageAt: string | null;
  unreadCount: number;
}

/**
 * A single chat message from backend.
 */
export interface Message {
  _id: string;
  conversationId: string;
  sender: ChatUser;
  content: string;
  type: 'text' | 'image' | 'story_reply';
  storyReference?: {
    storyId?: string;
    imageUrl?: string;
    caption?: string;
  };
  readBy: string[];
  createdAt: string;
}

