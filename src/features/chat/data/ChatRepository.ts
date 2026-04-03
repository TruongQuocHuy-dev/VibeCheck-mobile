import { IChatRepository } from '../domain/repositories/IChatRepository';
import { Message } from '../domain/types/chat.types';
import {
  fetchMessages,
  sendMessageApi,
  toggleReactionApi,
  markAsReadApi,
  deleteMessageApi,
  clearConversationApi,
  getChatMediaApi,
  blockUserApi,
  unblockUserApi,
  pinConversationApi,
  markAsUnreadApi,
  uploadMediaApi,
  markAsDeliveredApi,
} from '../../../infrastructure/services/chat.service';

export class ChatRepository implements IChatRepository {
  async getMessages(conversationId: string, page: number, limit: number): Promise<Message[]> {
    return await fetchMessages(conversationId, page, limit);
  }

  async sendMessage(
    conversationId: string,
    content: string,
    type: 'text' | 'image' | 'video' | 'audio' | 'story_reply',
    replyToId?: string,
    media?: { 
      uri: string; 
      type: 'image' | 'video' | 'audio'; 
      publicId?: string;
      mediaList?: Array<{ url: string; publicId: string; mediaType: 'image' | 'video' | 'audio' }>;
    }
  ): Promise<Message> {
    return await sendMessageApi(conversationId, content, type, replyToId, media);
  }

  async uploadMedia(
    uri: string,
    name: string,
    type: string
  ): Promise<{ url: string; publicId: string; type: 'image' | 'audio' | 'video' }> {
    return await uploadMediaApi(uri, name, type);
  }

  async toggleReaction(messageId: string, emoji: string): Promise<Message> {
    return await toggleReactionApi(messageId, emoji);
  }

  async markAsRead(conversationId: string): Promise<void> {
    await markAsReadApi(conversationId);
  }

  async markAsDelivered(messageId: string): Promise<void> {
    await markAsDeliveredApi(messageId);
  }

  async deleteMessage(messageId: string, type: 'me' | 'all'): Promise<void> {
    await deleteMessageApi(messageId, type);
  }

  async clearConversation(conversationId: string): Promise<void> {
    await clearConversationApi(conversationId);
  }

  async getChatMedia(conversationId: string, page: number, limit: number): Promise<Message[]> {
    return await getChatMediaApi(conversationId, page, limit);
  }

  async blockUser(userId: string): Promise<void> {
    await blockUserApi(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    await unblockUserApi(userId);
  }

  async pinConversation(conversationId: string): Promise<void> {
    await pinConversationApi(conversationId);
  }

  async unpinConversation(conversationId: string): Promise<void> {
    // Both pin/unpin use togglePinConversation on backend
    await pinConversationApi(conversationId);
  }

  async markAsUnread(conversationId: string): Promise<void> {
    await markAsUnreadApi(conversationId);
  }
}

// Singleton instance
export const chatRepository = new ChatRepository();
