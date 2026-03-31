import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { fetchConversations } from '../../data/chat.service';
import {
  onSocketEvent,
  offSocketEvent,
} from '../../../../infrastructure/services/socket.service';
import type { ConversationItem, Message } from '../../domain/types/chat.types';

interface UseChat {
  chatList: ConversationItem[];
  loading: boolean;
  error: string | null;
  handleChatPress: (conversationId: string, name: string, avatar: string | null, isOnline?: boolean) => void;
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

    onSocketEvent<{ conversationId: string; message: Message }>('message_notification', handleNewMessage);
    onSocketEvent<unknown>('new_match', handleNewMatch);
    onSocketEvent<unknown>('status_update', handleStatusUpdate);

    return () => {
      offSocketEvent<{ conversationId: string; message: Message }>('message_notification', handleNewMessage);
      offSocketEvent<unknown>('new_match', handleNewMatch);
      offSocketEvent<unknown>('status_update', handleStatusUpdate);
    };
  }, [loadConversations]);

  const handleChatPress = useCallback(
    (conversationId: string, name: string, avatar: string | null, isOnline?: boolean) => {
      navigation.navigate('ChatDetail', {
        conversationId,
        name,
        avatar,
        isOnline: isOnline ?? false,
      });
    },
    [navigation]
  );

  const handleEdit = useCallback(() => {
    // Placeholder for new conversation / search
  }, []);

  return {
    chatList,
    loading,
    error,
    handleChatPress,
    handleEdit,
    refreshList: loadConversations,
  };
};
