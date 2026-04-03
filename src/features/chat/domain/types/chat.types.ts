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
  isPinned: boolean;
  clearedAt?: string | null;
  blockedByMe?: boolean;
  isBlockedByOther?: boolean;
}

export interface Reaction {
  userId: string;
  emoji: string;
  createdAt: string;
}

/**
 * A single chat message from backend.
 */
export interface Message {
  _id: string;
  conversationId: string;
  sender: ChatUser;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'story_reply';
  storyReference?: {
    storyId?: string;
    imageUrl?: string;
    caption?: string;
  };
  replyTo?: Message;
  reactions?: Reaction[];
  mediaUrl?: string;
  publicId?: string;
  mediaType?: 'image' | 'video' | 'audio';
  mediaList?: Array<{
    url: string;
    publicId: string;
    mediaType: 'image' | 'video' | 'audio';
  }>;
  readBy: string[];
  deliveredBy: string[];
  deletedBy?: string[];
  isRecalled?: {
    status: boolean;
    by: string;
    at: string;
  };
  createdAt: string;
  isMe?: boolean; // UI flag
  status?: 'sending' | 'sent' | 'error'; // UI flag
}

