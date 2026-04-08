import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export interface NotificationPayload {
  id: string;
  kind: 'match' | 'message' | 'like' | 'story' | 'system';
  title: string;
  message: string;
  avatar: string | null;
  isUnread: boolean;
  metadata: Record<string, any>;
  createdAt: string;
}

export const NotificationService = {
  getAll: async (page = 1, limit = 30): Promise<{
    items: NotificationPayload[];
    unreadCount: number;
    pagination: { page: number; limit: number; total: number; hasMore: boolean };
  }> => {
    const data = await apiClient.get<any, any>(ENDPOINTS.NOTIFICATIONS.LIST, {
      params: { page, limit },
    });
    return data;
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.patch(ENDPOINTS.NOTIFICATIONS.READ_ALL);
  },

  markOneRead: async (id: string): Promise<void> => {
    await apiClient.patch(ENDPOINTS.NOTIFICATIONS.READ_ONE(id));
  },

  deleteOne: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.NOTIFICATIONS.DELETE_ONE(id));
  },

  deleteAll: async (): Promise<void> => {
    await apiClient.delete(ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
  },
};
