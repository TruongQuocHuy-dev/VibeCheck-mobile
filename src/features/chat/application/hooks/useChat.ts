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
      setChatList((prev) =>
        prev.map((conv) =>
          conv.id === payload.conversationId
            ? {
                ...conv,
                lastMessage: payload.message.content,
                lastMessageAt: payload.message.createdAt,
                unreadCount: conv.unreadCount + 1,
              }
            : conv
        )
      );
    };

    const handleNewMatch = () => {
      // New match = new conversation, reload the list
      loadConversations();
    };

    onSocketEvent<{ conversationId: string; message: Message }>('message_notification', handleNewMessage);
    onSocketEvent<unknown>('new_match', handleNewMatch);

    return () => {
      offSocketEvent('message_notification');
      offSocketEvent('new_match');
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
