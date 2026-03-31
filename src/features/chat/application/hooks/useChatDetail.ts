import { useState, useEffect, useCallback, useRef } from 'react';
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

import { useUnreadCount } from '../../../../shared/providers/UnreadProvider';

export const useChatDetail = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatDetailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserIdRef = useRef<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserStatus, setOtherUserStatus] = useState<{ isOnline: boolean; lastActive: string | null }>({
    isOnline: false,
    lastActive: null,
  });
  const { refreshUnread, setActiveConversationId } = useUnreadCount();

  const loadMessages = useCallback(async (userId: string) => {
    if (!conversationId || conversationId === '1') {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const data = await fetchMessages(conversationId);
      const mapped = data.map(msg => {
        const senderId = (msg.sender as any)?._id || (msg.sender as any);
        return {
          ...msg,
          isMe: senderId === userId
        };
      });
      setMessages(mapped);
      
      // Successfully loaded messages, so they are marked as read on server.
      // Refresh the global unread count to update the target tab badge.
      refreshUnread();
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, refreshUnread]);

  useEffect(() => {
    // Set active conversation to avoid badge incrementing for this room
    setActiveConversationId(conversationId);
    
    return () => {
      setActiveConversationId(null);
    };
  }, [conversationId, setActiveConversationId]);

  useEffect(() => {
    const init = async () => {
      const user: any = await getUser();
      const userId = user?.id || user?._id;
      currentUserIdRef.current = userId;
      if (userId) {
        loadMessages(userId);
      }
    };
    init();

    if (conversationId && conversationId !== '1') {
      joinConversation(conversationId);

      const handleNewMessage = (payload: { conversationId: string; message: Message }) => {
        if (payload.conversationId === conversationId) {
          const senderId = (payload.message.sender as any)?._id || (payload.message.sender as any);
          
          setMessages((prev) => {
            // 1. Check if message with this ID already exists (from API response)
            if (prev.some(m => m._id === payload.message._id)) return prev;
            
            // 2. Check if this is a message we just sent (Optimistic Update)
            // If it's from me and matches a "temp" message, we prefer the server version
            const isMe = senderId === currentUserIdRef.current;
            if (isMe) {
              const tempIndex = prev.findIndex(m => m._id.toString().startsWith('temp-') && m.content === payload.message.content);
              if (tempIndex !== -1) {
                const newMessages = [...prev];
                newMessages[tempIndex] = { ...payload.message, isMe: true };
                return newMessages;
              }
            }

            return [
              ...prev, 
              { 
                ...payload.message, 
                isMe
              }
            ];
          });
        }
      };

      const handleStatusUpdate = (payload: { userId: string; isOnline: boolean; lastActive: string }) => {
        setOtherUserStatus({
          isOnline: payload.isOnline,
          lastActive: payload.lastActive,
        });
      };

      onSocketEvent<{ conversationId: string; message: Message }>('new_message', handleNewMessage);
      onSocketEvent<any>('status_update', handleStatusUpdate);

      return () => {
        leaveConversation(conversationId);
        offSocketEvent<{ conversationId: string; message: Message }>('new_message', handleNewMessage);
        offSocketEvent<any>('status_update', handleStatusUpdate);
      };
    }
  }, [conversationId, loadMessages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !conversationId) return;

    // Optimistic Update
    const tempMessage: ChatDetailMessage = {
      _id: `temp-${Date.now()}`,
      conversationId,
      sender: {
        _id: currentUserIdRef.current || 'me',
        displayName: 'You',
        fullName: 'You',
        avatar: null,
      },
      content: text,
      type: 'text',
      createdAt: new Date().toISOString(),
      readBy: [],
      isMe: true,
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const response: any = await sendMessageApi(conversationId, text);
      const realMessage = response.data || response;
      
      // Replace temp message with real one from server
      setMessages(prev => 
        prev.map(m => m._id === tempMessage._id ? { ...realMessage, isMe: true } : m)
      );
    } catch (err) {
      console.error('Send message error:', err);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m._id !== tempMessage._id));
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    isTyping,
    otherUserStatus,
    setOtherUserStatus, 
    refreshMessages: loadMessages,
  };
};
