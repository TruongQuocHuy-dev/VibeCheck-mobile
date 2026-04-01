import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, Reaction } from '../../domain/types/chat.types';
import { chatRepository } from '../../data/ChatRepository';
import { chatSocketService } from '../../data/ChatSocketService';
import { getUser } from '../../../../infrastructure/storage/AsyncStorage';
import { useUnreadCount } from '../../../../shared/providers/UnreadProvider';

interface InitialStatus {
  isOnline: boolean;
  lastActive: string | null;
  otherUserId?: string;
}

export const useChatDetail = (conversationId: string, initialStatus?: InitialStatus) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false); // Guard for initial scroll jump
  const [isBlocked, setIsBlocked] = useState(false);
  
  // Refs for stable variables and state tracking
  const currentUserIdRef = useRef<string | null>(null);
  const otherUserIdRef = useRef<string | null>(initialStatus?.otherUserId || null);
  const typingTimeoutRef = useRef<any>(null);
  const isFetchingRef = useRef<boolean>(false);
  
  const [otherUserStatus, setOtherUserStatus] = useState<{ isOnline: boolean; lastActive: string | null }>({
    isOnline: initialStatus?.isOnline ?? false,
    lastActive: initialStatus?.lastActive ?? null,
  });
  
  const { refreshUnread, setActiveConversationId } = useUnreadCount();

  const markRead = useCallback(async () => {
    if (!conversationId || conversationId === '1') return;
    try {
      await chatRepository.markAsRead(conversationId);
      refreshUnread();
    } catch (err) {
      // Shhh
    }
  }, [conversationId, refreshUnread]);

  const formatLastActive = (dateString?: string | Date | null): string => {
    if (!dateString) return 'Ngoại tuyến';
    const activeDate = new Date(dateString);
    if (isNaN(activeDate.getTime())) return 'Ngoại tuyến';
    const now = new Date();
    const diffMs = now.getTime() - activeDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa hoạt động';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return 'Ngoại tuyến';
  };

  const loadMessages = useCallback(async (isLoadMore = false) => {
    if (!conversationId || conversationId === '1' || isFetchingRef.current) return;
    if (isLoadMore && (!hasMore || !canLoadMore)) return;
    
    isFetchingRef.current = true;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      const data = await chatRepository.getMessages(conversationId, currentPage, 20);
      
      const userId = currentUserIdRef.current;
      const normalizedUserId = userId?.toString();

      const mapped = data.map(msg => {
        const senderObj = msg.sender as any;
        const senderId = (senderObj?._id || senderObj?.id || senderObj)?.toString();
        if (!otherUserIdRef.current && senderId && senderId !== normalizedUserId) {
          otherUserIdRef.current = senderId;
        }
        return {
          ...msg,
          isMe: !!senderId && !!normalizedUserId && senderId === normalizedUserId,
          status: 'sent' as const
        };
      });

      if (isLoadMore) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m._id));
          const newBatch = mapped.filter(m => !existingIds.has(m._id));
          return [...prev, ...newBatch];
        });
        setPage(currentPage);
      } else {
        setMessages(mapped);
        setPage(1);
        markRead();
        // Allow load more only after initial data is rendered and scrolled to bottom
        setTimeout(() => setCanLoadMore(true), 500); 
      }

      setHasMore(data.length === 20);
    } catch (err) {
      console.error('Load messages error:', err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [conversationId, page, hasMore, canLoadMore, markRead]);

  // Reset state on conversation change
  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setCanLoadMore(false);
    isFetchingRef.current = false;
  }, [conversationId]);

  useEffect(() => {
    setActiveConversationId(conversationId);
    return () => setActiveConversationId(null);
  }, [conversationId, setActiveConversationId]);

  useEffect(() => {
    const init = async () => {
      const user: any = await getUser();
      const userId = (user?._id || user?.id || user?.uid)?.toString();
      currentUserIdRef.current = userId ?? null;
      if (userId && conversationId && conversationId !== '1') {
        loadMessages();
      }
    };
    init();

    if (conversationId && conversationId !== '1') {
      chatSocketService.joinRoom(conversationId);

      const handleNewMessage = (payload: { conversationId: string; message: Message }) => {
        if (payload.conversationId === conversationId) {
          setMessages(prev => {
            if (prev.some(m => m._id === payload.message._id)) return prev;
            const senderObj = payload.message.sender as any;
            const senderId = (senderObj?._id || senderObj?.id || senderObj)?.toString();
            const normalizedCurrentUserId = currentUserIdRef.current?.toString();
            const isMe = !!senderId && !!normalizedCurrentUserId && senderId === normalizedCurrentUserId;

            if (!isMe && !otherUserIdRef.current) {
              otherUserIdRef.current = senderId;
            }
            if (isMe) {
              const tempIndex = prev.findIndex(m => m._id.startsWith('temp-') && m.content === payload.message.content);
              if (tempIndex !== -1) {
                const updated = [...prev];
                updated[tempIndex] = { ...payload.message, isMe: true, status: 'sent' };
                return updated;
              }
            }
            if (!isMe) markRead();
            return [{ ...payload.message, isMe, status: 'sent' }, ...prev];
          });
          setIsPeerTyping(false);
        }
      };

      const handleReactionUpdate = (payload: { messageId: string; reactions: Reaction[] }) => {
        setMessages(prev => prev.map(m => 
          m._id === payload.messageId ? { ...m, reactions: payload.reactions } : m
        ));
      };

      const handleMessageRecalled = (payload: { messageId: string }) => {
        setMessages(prev => prev.map(m => 
          m._id === payload.messageId ? { ...m, isRecalled: { status: true, by: 'other', at: new Date().toISOString() } } : m
        ));
      };

      const handleStatusUpdate = (payload: { userId: string; isOnline: boolean; lastActive: string }) => {
        const updatedUserId = payload.userId.toString();
        const targetUserId = otherUserIdRef.current?.toString();
        if (updatedUserId === targetUserId) {
          setOtherUserStatus({ isOnline: payload.isOnline, lastActive: payload.lastActive });
        }
      };

      const handleTyping = (payload: { conversationId: string; userId: string }) => {
        if (payload.conversationId === conversationId && payload.userId !== currentUserIdRef.current) {
          setIsPeerTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsPeerTyping(false), 5000);
        }
      };

      const handleStopTyping = (payload: { conversationId: string; userId: string }) => {
        if (payload.conversationId === conversationId && payload.userId !== currentUserIdRef.current) {
          setIsPeerTyping(false);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        }
      };

      chatSocketService.onNewMessage(handleNewMessage);
      chatSocketService.onReactionUpdate(handleReactionUpdate);
      chatSocketService.onMessageRecalled(handleMessageRecalled);
      chatSocketService.onUserStatusUpdate(handleStatusUpdate);
      chatSocketService.onTyping(handleTyping);
      chatSocketService.onStopTyping(handleStopTyping);

      return () => {
        chatSocketService.leaveRoom(conversationId);
        chatSocketService.offNewMessage(handleNewMessage);
        chatSocketService.offReactionUpdate(handleReactionUpdate);
        chatSocketService.offMessageRecalled(handleMessageRecalled);
        chatSocketService.offUserStatusUpdate(handleStatusUpdate);
        chatSocketService.offTyping();
        chatSocketService.offStopTyping();
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      };
    }
  }, [conversationId]); 

  const sendMessage = async (content: string, type: Message['type'] = 'text') => {
    if (!content.trim() || !conversationId) return;
    chatSocketService.emitStopTyping(conversationId);
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      _id: tempId,
      conversationId,
      sender: { _id: currentUserIdRef.current || 'me', displayName: 'You', fullName: 'You', avatar: null },
      content,
      type,
      replyTo: replyingTo || undefined,
      createdAt: new Date().toISOString(),
      readBy: [],
      isMe: true,
      status: 'sending',
    };
    setMessages(prev => [tempMessage, ...prev]);
    setReplyingTo(null);
    try {
      const realMessage = await chatRepository.sendMessage(conversationId, content, type, replyingTo?._id);
      setMessages(prev => prev.map(m => m._id === tempId ? { ...realMessage, isMe: true, status: 'sent' } : m));
    } catch (err) {
      console.error('Send message error:', err);
      setMessages(prev => prev.map(m => m._id === tempId ? { ...m, status: 'error' } : m));
    }
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    const userId = currentUserIdRef.current;
    if (!userId) return;
    setMessages(prev => prev.map(m => {
      if (m._id !== messageId) return m;
      const currentReactions = m.reactions || [];
      const existingIdx = currentReactions.findIndex(r => r.userId === userId && r.emoji === emoji);
      let nextReactions;
      if (existingIdx > -1) {
        nextReactions = currentReactions.filter((_, i) => i !== existingIdx);
      } else {
        nextReactions = [...currentReactions, { userId, emoji, createdAt: new Date().toISOString() }];
      }
      return { ...m, reactions: nextReactions };
    }));
    try {
      await chatRepository.toggleReaction(messageId, emoji);
    } catch (err) {
      console.error('Reaction error:', err);
    }
  };

  const sendTypingStatus = (isTyping: boolean) => {
    if (!conversationId) return;
    if (isTyping) chatSocketService.emitTyping(conversationId);
    else chatSocketService.emitStopTyping(conversationId);
  };

  const deleteMessage = async (messageId: string, type: 'me' | 'all') => {
    const previousMessages = [...messages];
    const userId = currentUserIdRef.current;

    // Optimistic UI
    if (type === 'all') {
      setMessages(prev => prev.map(m => 
        m._id === messageId ? { ...m, isRecalled: { status: true, by: userId || 'me', at: new Date().toISOString() } } : m
      ));
    } else {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    }

    try {
      await chatRepository.deleteMessage(messageId, type);
    } catch (err) {
      console.error('Delete message error:', err);
      // Rollback
      setMessages(previousMessages);
      throw err; // Let caller handle UI notification
    }
  };

  const clearHistory = async () => {
    const previousMessages = [...messages];
    setMessages([]); // Optimistic
    try {
      await chatRepository.clearConversation(conversationId);
    } catch (err) {
      console.error('Clear history error:', err);
      setMessages(previousMessages);
      throw err;
    }
  };

  const blockUser = async () => {
    if (!otherUserIdRef.current) return;
    try {
      await chatRepository.blockUser(otherUserIdRef.current);
    } catch (err) {
      console.error('Block user error:', err);
      throw err;
    }
  };

  const getMedia = async (p: number = 1) => {
    try {
      return await chatRepository.getChatMedia(conversationId, p, 20);
    } catch (err) {
      console.error('Get media error:', err);
      return [];
    }
  };

  return {
    messages: messages.filter(m => !m.deletedBy?.includes(currentUserIdRef.current || '')),
    loading,
    loadingMore,
    hasMore,
    loadMore: () => canLoadMore && hasMore && loadMessages(true),
    sendMessage,
    toggleReaction,
    deleteMessage,
    clearHistory,
    blockUser: async () => {
      await blockUser();
      setIsBlocked(true);
    },
    getMedia,
    isBlocked,
    replyingTo,
    setReplyingTo,
    otherUserStatus,
    setOtherUserStatus,
    formatLastActive,
    isPeerTyping,
    sendTypingStatus,
    markRead,
  };
};
