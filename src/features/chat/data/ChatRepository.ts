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
} from '../../../infrastructure/services/chat.service';

export class ChatRepository implements IChatRepository {
  async getMessages(conversationId: string, page: number, limit: number): Promise<Message[]> {
    return await fetchMessages(conversationId, page, limit);
  }

  async sendMessage(
    conversationId: string,
    content: string,
    type: 'text' | 'image' | 'video' | 'story_reply',
    replyToId?: string,
    media?: { uri: string; type: 'image' | 'video' }
  ): Promise<Message> {
    return await sendMessageApi(conversationId, content, type, replyToId, media);
  }

  async toggleReaction(messageId: string, emoji: string): Promise<Message> {
    return await toggleReactionApi(messageId, emoji);
  }

  async markAsRead(conversationId: string): Promise<void> {
    await markAsReadApi(conversationId);
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
}

// Singleton instance
export const chatRepository = new ChatRepository();
