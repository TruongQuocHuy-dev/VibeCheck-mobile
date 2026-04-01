import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { Message, ConversationItem } from '../../features/chat/domain/types/chat.types';

/**
 * Fetch messages for a conversation.
 */
export const fetchMessages = async (
  conversationId: string,
  page = 1,
  limit = 20
): Promise<Message[]> => {
  const url = ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId);
  const data = await apiClient.get<any, Message[]>(url, { params: { page, limit } });
  return data;
};

/**
 * Fetch all conversations for the current user.
 */
export const fetchConversations = async (): Promise<ConversationItem[]> => {
  const url = ENDPOINTS.CONVERSATIONS.LIST;
  const data = await apiClient.get<any, ConversationItem[]>(url);
  return data;
};

/**
 * Send a new message.
 */
export const sendMessageApi = async (
  conversationId: string,
  content: string,
  type: 'text' | 'image' | 'video' | 'story_reply' = 'text',
  parentMessageId?: string,
  media?: { uri: string; type: 'image' | 'video' }
): Promise<Message> => {
  const url = ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId);
  const payload = { content, type, parentMessageId, media };
  const data = await apiClient.post<any, Message>(url, payload);
  return data;
};

/**
 * Toggle a reaction on a message.
 */
export const toggleReactionApi = async (
  messageId: string,
  emoji: string | null
): Promise<Message> => {
  const url = ENDPOINTS.MESSAGES.REACTION(messageId);
  // Backend toggleReaction returns { status: 'success', data: message.reactions } or message
  // We need to ensure it returns what ChatRepository expects (Message)
  const data = await apiClient.post<any, any>(url, { emoji });
  return data; // Assuming interceptor returns data object
};

/**
 * Mark a conversation as read.
 */
export const markAsReadApi = async (conversationId: string): Promise<void> => {
  const url = ENDPOINTS.CONVERSATIONS.READ(conversationId);
  await apiClient.post(url);
};

/**
 * Delete or recall a message.
 */
export const deleteMessageApi = async (messageId: string, type: 'me' | 'all'): Promise<void> => {
  const url = ENDPOINTS.MESSAGES.ACTION(messageId);
  await apiClient.delete(url, { params: { type } });
};

/**
 * Clear all messages in a conversation for the current user.
 */
export const clearConversationApi = async (conversationId: string): Promise<void> => {
  const url = ENDPOINTS.CONVERSATIONS.CLEAR_HISTORY(conversationId);
  await apiClient.delete(url);
};

/**
 * Fetch media (images/videos) from a conversation.
 */
export const getChatMediaApi = async (
  conversationId: string,
  page = 1,
  limit = 20
): Promise<Message[]> => {
  const url = ENDPOINTS.CONVERSATIONS.MEDIA(conversationId);
  const data = await apiClient.get<any, Message[]>(url, { params: { page, limit } });
  return data;
};

/**
 * Block a user.
 */
export const blockUserApi = async (userId: string): Promise<void> => {
  const url = ENDPOINTS.USER.BLOCK_USER(userId);
  await apiClient.post(url);
};
