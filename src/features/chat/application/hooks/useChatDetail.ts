import { useState, useEffect, useCallback } from 'react';
import { Message } from '../../domain/types/chat.types';
import { fetchMessages, sendMessageApi } from '../../data/chat.service';
import { getUser } from '../../../../infrastructure/storage/AsyncStorage';
import { 
  onSocketEvent, 
  offSocketEvent, 
  joinConversation, 
  leaveConversation 
} from '../../../../infrastructure/services/socket.service';

interface ChatDetailMessage extends Message {
  isMe: boolean;
}

export const useChatDetail = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatDetailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const loadMessages = useCallback(async (userId: string) => {
    if (!conversationId || conversationId === '1') {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await fetchMessages(conversationId);
      const mapped = data.map(msg => ({
        ...msg,
        isMe: (msg.sender as any)?._id === userId || (msg.sender as any) === userId
      }));
      setMessages(mapped);
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    const init = async () => {
      const user: any = await getUser();
      const userId = user?.id || user?._id;
      setCurrentUserId(userId);
      if (userId) {
        loadMessages(userId);
      }
    };
    init();

    if (conversationId && conversationId !== '1') {
      joinConversation(conversationId);

      const handleNewMessage = (payload: { conversationId: string; message: Message }) => {
        if (payload.conversationId === conversationId) {
          setMessages((prev) => [
            ...prev, 
            { 
              ...payload.message, 
              isMe: (payload.message.sender as any)?._id === currentUserId || (payload.message.sender as any) === currentUserId 
            }
          ]);
        }
      };

      onSocketEvent<{ conversationId: string; message: Message }>('new_message', handleNewMessage);

      return () => {
        leaveConversation(conversationId);
        offSocketEvent<{ conversationId: string; message: Message }>('new_message', handleNewMessage);
      };
    }
  }, [conversationId, loadMessages, currentUserId]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !conversationId) return;

    try {
      // Optimistic update could go here, but let's stick to API + socket for now
      await sendMessageApi(conversationId, text);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    isTyping,
    refreshMessages: loadMessages,
  };
};
