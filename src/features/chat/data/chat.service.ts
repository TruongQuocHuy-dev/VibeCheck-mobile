import apiClient from '../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../infrastructure/api/endpoints';
import type { ConversationItem, Message } from '../domain/types/chat.types';

/**
 * Fetch the list of conversations for the current user.
 */
export const fetchConversations = async (): Promise<ConversationItem[]> => {
  const data = await apiClient.get<any, ConversationItem[]>(ENDPOINTS.CONVERSATIONS.LIST);
  return data;
};

/**
 * Fetch paginated messages for a conversation.
 */
export const fetchMessages = async (
  conversationId: string,
  page = 1,
  limit = 30
): Promise<Message[]> => {
  const url = ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId);
  const data = await apiClient.get<any, Message[]>(url, {
    params: { page, limit },
  });
  return data;
};

/**
 * Send a text message (REST fallback).
 * In real-time flow, the message is also emitted via Socket.io.
 */
export const sendMessageApi = async (
  conversationId: string,
  content: string,
  type: 'text' | 'image' = 'text'
): Promise<Message> => {
  const url = ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId);
  const data = await apiClient.post<any, Message>(url, { content, type });
  return data;
};
