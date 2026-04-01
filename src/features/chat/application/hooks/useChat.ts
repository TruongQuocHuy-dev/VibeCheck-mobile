import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { fetchConversations } from '../../../../infrastructure/services/chat.service';
import {
  onSocketEvent,
  offSocketEvent,
} from '../../../../infrastructure/services/socket.service';
import type { ConversationItem, Message } from '../../domain/types/chat.types';

interface UseChat {
  chatList: ConversationItem[];
  loading: boolean;
  error: string | null;
  handleChatPress: (conversationId: string, name: string, avatar: string | null, isOnline?: boolean, otherUserId?: string, lastActive?: string | null) => void;
  handleEdit: () => void;
  refreshList: () => void;
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

        // Move it to the top: Filter it out of its current position and prepend it
        const otherConvs = prev.filter((conv) => conv.id !== payload.conversationId);
        return [updatedConv, ...otherConvs];
      });
    };

    const handleNewMatch = () => {
      // New match = new conversation, reload the list
      loadConversations();
    };

    const handleStatusUpdate = () => {
      // Refresh to get new online statuses
      loadConversations();
    };

    const handleMessageRecalled = (payload: { conversationId: string; content?: string }) => {
      console.log(`[Inbox] Received recall event for conversation: ${payload.conversationId}`);
      if (!payload.content) return;
      setChatList((prev) => 
        prev.map((conv) => {
          if (conv.id === payload.conversationId) {
            console.log(`[Inbox] Matched conversation! Updating preview to: ${payload.content}`);
            return { ...conv, lastMessage: payload.content! };
          }
          return conv;
        })
      );
    };

    onSocketEvent<{ conversationId: string; message: Message }>('message_notification', handleNewMessage);
    onSocketEvent<unknown>('new_match', handleNewMatch);
    onSocketEvent<unknown>('status_update', handleStatusUpdate);
    onSocketEvent<{ conversationId: string; content?: string }>('message_recalled', handleMessageRecalled);

    return () => {
      offSocketEvent<{ conversationId: string; message: Message }>('message_notification', handleNewMessage);
      offSocketEvent<unknown>('new_match', handleNewMatch);
      offSocketEvent<unknown>('status_update', handleStatusUpdate);
      offSocketEvent<{ conversationId: string; content?: string }>('message_recalled', handleMessageRecalled);
    };
  }, [loadConversations]);

  const handleChatPress = useCallback(
    (conversationId: string, name: string, avatar: string | null, isOnline?: boolean, otherUserId?: string, lastActive?: string | null) => {
      navigation.navigate('ChatDetail', {
        conversationId,
        name,
        avatar,
        isOnline: isOnline ?? false,
        otherUserId,
        lastActive,
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
  };
};
