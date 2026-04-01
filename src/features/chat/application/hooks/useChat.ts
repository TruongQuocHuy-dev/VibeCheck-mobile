import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { fetchConversations } from '../../../../infrastructure/services/chat.service';
import { onSocketEvent, offSocketEvent } from '../../../../infrastructure/services/socket.service';
import type { ConversationItem, Message } from '../../domain/types/chat.types';
import { chatRepository } from '../../data/ChatRepository';

interface UseChat {
  chatList: ConversationItem[];
  loading: boolean;
  error: string | null;
  handleChatPress: (
    conversationId: string, 
    name: string, 
    avatar: string | null, 
    isOnline?: boolean, 
    otherUserId?: string, 
    lastActive?: string | null,
    blockedByMe?: boolean,
    isBlockedByOther?: boolean
  ) => void;
  handleEdit: () => void;
  refreshList: () => void;
  pinConversation: (id: string) => Promise<void>;
  unpinConversation: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
}

export const useChat = (): UseChat => {
  const navigation = useNavigation<any>();
  const [chatList, setChatList] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchConversations();
      setChatList(data);
    } catch (err: any) {
      setError(err?.message ?? 'Không thể tải tin nhắn.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();

    // Listen for new messages from socket to update the inbox preview
    const handleNewMessage = (payload: { conversationId: string; message: Message }) => {
      setChatList((prev) => {
        // Find the conversation to update
        const existingConv = prev.find((conv) => conv.id === payload.conversationId);
        if (!existingConv) return prev;

        const updatedConv: ConversationItem = {
          ...existingConv,
          lastMessage: payload.message.content,
          lastMessageAt: payload.message.createdAt,
          unreadCount: existingConv.unreadCount + 1,
        };

        // Move it to the top within its group (pinned vs unpinned)
        const otherConvs = prev.filter((conv) => conv.id !== payload.conversationId);
        const result = [updatedConv, ...otherConvs];
        
        // Re-sort: pinned first, then by date
        return [...result].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(a.lastMessageAt || 0).getTime() - new Date(b.lastMessageAt || 0).getTime();
        });
      });
    };

    const handleNewMatch = () => loadConversations();
    const handleStatusUpdate = () => loadConversations();

    const handlePinEvent = (payload: { conversationId: string; isPinned: boolean }) => {
      setChatList((prev) => {
        const updated = prev.map(c => c.id === payload.conversationId ? { ...c, isPinned: payload.isPinned } : c);
        return [...updated].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(a.lastMessageAt || 0).getTime() - new Date(b.lastMessageAt || 0).getTime();
        });
      });
    };

    const handleUnreadEvent = (payload: { conversationId: string; unreadCount: number }) => {
      setChatList(prev => prev.map(c => c.id === payload.conversationId ? { ...c, unreadCount: payload.unreadCount } : c));
    };

    const handleClearedEvent = (payload: { conversationId: string }) => {
      setChatList(prev => prev.filter(c => c.id !== payload.conversationId));
    };

    const handleBlockEvent = (payload: { targetUserId: string; isBlocked: boolean; blockedByMe: boolean }) => {
      // Refresh the entire list when a block occurs to ensure all flags and visibility are correct
      loadConversations();
    };

    onSocketEvent<{ conversationId: string; message: Message }>('message_notification', handleNewMessage);
    onSocketEvent<unknown>('new_match', handleNewMatch);
    onSocketEvent<unknown>('status_update', handleStatusUpdate);
    onSocketEvent<{ conversationId: string; isPinned: boolean }>('conversation_pinned', handlePinEvent);
    onSocketEvent<{ conversationId: string; unreadCount: number }>('conversation_unread', handleUnreadEvent);
    onSocketEvent<{ conversationId: string }>('conversation_cleared', handleClearedEvent);
    onSocketEvent<{ targetUserId: string; isBlocked: boolean; blockedByMe: boolean }>('user_blocked', handleBlockEvent);

    return () => {
      offSocketEvent('message_notification', handleNewMessage);
      offSocketEvent('new_match', handleNewMatch);
      offSocketEvent('status_update', handleStatusUpdate);
      offSocketEvent('conversation_pinned', handlePinEvent);
      offSocketEvent('conversation_unread', handleUnreadEvent);
      offSocketEvent('conversation_cleared', handleClearedEvent);
      offSocketEvent('user_blocked', handleBlockEvent);
    };
  }, [loadConversations]);

  const pinConversation = async (id: string) => {
    // Optimistic Update
    setChatList(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, isPinned: true } : c);
      return [...updated].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(a.lastMessageAt || 0).getTime() - new Date(b.lastMessageAt || 0).getTime();
      });
    });
    try {
      await chatRepository.pinConversation(id);
    } catch {
      loadConversations(); // Rollback
    }
  };

  const unpinConversation = async (id: string) => {
    setChatList(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, isPinned: false } : c);
      return [...updated].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(a.lastMessageAt || 0).getTime() - new Date(b.lastMessageAt || 0).getTime();
      });
    });
    try {
      await chatRepository.unpinConversation(id);
    } catch {
      loadConversations();
    }
  };

  const markAsUnread = async (id: string) => {
    setChatList(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 1 } : c));
    try {
      await chatRepository.markAsUnread(id);
    } catch {
      loadConversations();
    }
  };

  const deleteConversation = async (id: string) => {
    setChatList(prev => prev.filter(c => c.id !== id));
    try {
      await chatRepository.clearConversation(id);
    } catch {
      loadConversations();
    }
  };

  const handleChatPress = useCallback(
    (
      conversationId: string, 
      name: string, 
      avatar: string | null, 
      isOnline?: boolean, 
      otherUserId?: string, 
      lastActive?: string | null,
      blockedByMe?: boolean,
      isBlockedByOther?: boolean
    ) => {
      navigation.navigate('ChatDetail', {
        conversationId,
        name,
        avatar,
        isOnline: isOnline ?? false,
        otherUserId,
        lastActive,
        blockedByMe,
        isBlockedByOther,
      });
    },
    [navigation]
  );

  const handleEdit = useCallback(() => {
    navigation.navigate('Matches');
  }, [navigation]);

  return {
    chatList,
    loading,
    error,
    handleChatPress,
    handleEdit,
    refreshList: loadConversations,
    pinConversation,
    unpinConversation,
    markAsUnread,
    deleteConversation,
  };
};
