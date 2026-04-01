import { Message, ConversationItem } from '../types/chat.types';

export interface IChatRepository {
  /**
   * Fetch paginated messages for a conversation.
   * @param conversationId 
   * @param page 
   * @param limit 
   */
  getMessages(conversationId: string, page: number, limit: number): Promise<Message[]>;

  /**
   * Send a new message.
   * @param conversationId 
   * @param content 
   * @param type 
   * @param replyToId Optional ID of the message being replied to
   * @param media Optional media object
   */
  sendMessage(
    conversationId: string, 
    content: string, 
    type: 'text' | 'image' | 'video' | 'story_reply',
    replyToId?: string,
    media?: { uri: string; type: 'image' | 'video' }
  ): Promise<Message>;

  /**
   * Toggle a reaction on a message.
   * @param messageId 
   * @param emoji 
   */
  toggleReaction(messageId: string, emoji: string): Promise<Message>;

  /**
   * Mark all messages in a conversation as read.
   * @param conversationId 
   */
  markAsRead(conversationId: string): Promise<void>;

  /**
   * Delete or recall a message.
   * @param messageId 
   * @param type 'me' (delete locally) or 'all' (recall for everyone)
   */
  deleteMessage(messageId: string, type: 'me' | 'all'): Promise<void>;

  /**
   * Clear all messages in a conversation for the current user.
   */
  clearConversation(conversationId: string): Promise<void>;

  /**
   * Fetch media (images/videos) from a conversation.
   */
  getChatMedia(conversationId: string, page: number, limit: number): Promise<Message[]>;

  /**
   * Block a user.
   */
  blockUser(userId: string): Promise<void>;
}
