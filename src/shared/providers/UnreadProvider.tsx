import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { fetchConversations } from '../../infrastructure/services/chat.service';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { getAccessToken } from '../../infrastructure/storage/AsyncStorage';
import { ConversationItem } from '../../features/chat/domain/types/chat.types';
import { onSocketEvent, offSocketEvent } from '../../infrastructure/services/socket.service';

interface UnreadContextType {
  totalUnread: number;
  unreadNotifications: number;
  refreshUnread: () => Promise<void>;
  setActiveConversationId: (id: string | null) => void;
}

const UnreadContext = createContext<UnreadContextType | undefined>(undefined);

export const UnreadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalUnread, setTotalUnread] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const refreshUnread = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setTotalUnread(0);
        setUnreadNotifications(0);
        return;
      }

      // Fetch both messages and notifications unread counts
      const [conversations, notificationData] = await Promise.all([
        fetchConversations(),
        NotificationService.getAll(1, 1), // Just need the unreadCount
      ]);

      const messageTotal = conversations.reduce((acc: number, conv: ConversationItem) => acc + (conv.unreadCount || 0), 0);
      setTotalUnread(messageTotal);
      setUnreadNotifications(notificationData.unreadCount || 0);
    } catch (error) {
      console.error('[UnreadProvider] Error fetching unread count:', error);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    refreshUnread();

    const handleMessageNotification = (payload: { conversationId: string }) => {
      // Logic to avoid increasing badge if in the same room
      if (payload.conversationId === activeConversationId) {
        return;
      }
      
      // Increase local count for immediate feedback
      setTotalUnread(prev => prev + 1);
    };

    const handleUnreadNotificationCount = (payload: { unreadCount: number }) => {
      setUnreadNotifications(payload.unreadCount);
    };

    const handleNewMatch = () => {
      refreshUnread();
    };

    const setupListeners = () => {
      onSocketEvent('message_notification', handleMessageNotification);
      onSocketEvent('unread_notification_count', handleUnreadNotificationCount);
      onSocketEvent('new_match', handleNewMatch);
    };

    setupListeners();

    // Re-setup when socket connects (in case it wasn't ready at mount)
    const sub = DeviceEventEmitter.addListener('socket_connected', setupListeners);

    return () => {
      offSocketEvent('message_notification', handleMessageNotification);
      offSocketEvent('unread_notification_count', handleUnreadNotificationCount);
      offSocketEvent('new_match', handleNewMatch);
      sub.remove();
    };
  }, [refreshUnread, activeConversationId]);

  return (
    <UnreadContext.Provider value={{ totalUnread, unreadNotifications, refreshUnread, setActiveConversationId }}>
      {children}
    </UnreadContext.Provider>
  );
};

export const useUnreadCount = () => {
  const context = useContext(UnreadContext);
  if (context === undefined) {
    throw new Error('useUnreadCount must be used within an UnreadProvider');
  }
  return context;
};
