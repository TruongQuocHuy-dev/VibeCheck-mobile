/**
 * Interface representing a single chat message in the Conversation view.
 */
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text?: string;
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
  isMe: boolean;
}
