import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, Reaction } from '../../domain/types/chat.types';
import { chatRepository } from '../../data/ChatRepository';
import { chatSocketService } from '../../data/ChatSocketService';
import { getUser } from '../../../../infrastructure/storage/AsyncStorage';
import { ProfileService } from '../../../../infrastructure/services/profile.service';
import { useUnreadCount } from '../../../../shared/providers/UnreadProvider';
import { useToast } from '../../../../shared/hooks/useToast';

interface InitialStatus {
  isOnline?: boolean;
  lastActive?: string | null;
  otherUserId?: string;
  blockedByMe?: boolean;
  isBlockedByOther?: boolean;
}

export const useChatDetail = (conversationId: string, initialStatus?: InitialStatus) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false); // Guard for initial scroll jump
  const [blockedByMe, setBlockedByMe] = useState(initialStatus?.blockedByMe ?? false);
  const [isBlockedByOther, setIsBlockedByOther] = useState(initialStatus?.isBlockedByOther ?? false);
  
  // Refs for stable variables and state tracking
  const currentUserIdRef = useRef<string | null>(null);
  const otherUserIdRef = useRef<string | null>(initialStatus?.otherUserId || null);
  const typingTimeoutRef = useRef<any>(null);
  const isFetchingRef = useRef<boolean>(false);
  
  const [otherUserStatus, setOtherUserStatus] = useState<{ isOnline?: boolean; lastActive?: string | null }>({
    isOnline: initialStatus?.isOnline,
    lastActive: initialStatus?.lastActive ?? null,
  });

  const loadPeerStatus = useCallback(async () => {
    const targetId = otherUserIdRef.current;
    if (!targetId) return;

    try {
      const data = await ProfileService.getPublicProfile(targetId);
      if (data) {
        setOtherUserStatus({
          isOnline: data.isOnline,
          lastActive: data.lastActive || null,
        });
      }
    } catch (err) {
      console.warn('[useChatDetail] Failed to load peer status:', err);
    }
  }, []);

  const otherUserLastReadId = (() => {
    if (!otherUserIdRef.current) return null;
    const otherId = otherUserIdRef.current.toString();
    // Messages are sorted newest first. The first one read by other person is their latest "seen" point.
    return messages.find(m => m.isMe && m.readBy?.includes(otherId))?._id;
  })();
  
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
        // Load initial fresh status from API
        loadPeerStatus();
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
            if (!isMe) {
              markRead();
              chatRepository.markAsDelivered(payload.message._id).catch(() => {});
            }
            return [{ ...payload.message, isMe, status: 'sent', deliveredBy: payload.message.deliveredBy || [] }, ...prev];
          });
          setIsPeerTyping(false);
        }
      };

      const handleMessageDelivered = (payload: { messageId: string; userId: string }) => {
        setMessages(prev => prev.map(m => 
          m._id === payload.messageId ? { ...m, deliveredBy: [...(m.deliveredBy || []), payload.userId] } : m
        ));
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

      const handleStatusUpdate = (payload: { userId: string; isOnline?: boolean; lastActive?: string }) => {
        const updatedUserId = payload.userId.toString().toLowerCase();
        const targetUserId = otherUserIdRef.current?.toString().toLowerCase();
        if (updatedUserId === targetUserId) {
          setOtherUserStatus({ isOnline: payload.isOnline, lastActive: payload.lastActive ?? null });
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

      const handleUserBlocked = (payload: { targetUserId: string; isBlocked: boolean; blockedByMe: boolean }) => {
        const targetUserId = otherUserIdRef.current?.toString();
        if (payload.targetUserId.toString() === targetUserId) {
          if (payload.blockedByMe) {
            // I am the one who blocked/unblocked
            setBlockedByMe(payload.isBlocked);
          } else {
            // The other person blocked/unblocked me
            setIsBlockedByOther(payload.isBlocked);
          }
        }
      };

      chatSocketService.onNewMessage(handleNewMessage);
      chatSocketService.onMessageDelivered(handleMessageDelivered);
      chatSocketService.onReactionUpdate(handleReactionUpdate);
      chatSocketService.onMessageRecalled(handleMessageRecalled);
      chatSocketService.onUserStatusUpdate(handleStatusUpdate);
      chatSocketService.onTyping(handleTyping);
      chatSocketService.onStopTyping(handleStopTyping);
      chatSocketService.onUserBlocked(handleUserBlocked);

      return () => {
        chatSocketService.leaveRoom(conversationId);
        chatSocketService.offNewMessage(handleNewMessage);
        chatSocketService.offMessageDelivered(handleMessageDelivered);
        chatSocketService.offReactionUpdate(handleReactionUpdate);
        chatSocketService.offMessageRecalled(handleMessageRecalled);
        chatSocketService.offUserStatusUpdate(handleStatusUpdate);
        chatSocketService.offTyping();
        chatSocketService.offStopTyping();
        chatSocketService.offUserBlocked(handleUserBlocked);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      };
    }
  }, [conversationId]); 

  const sendMessage = async (
    content: string, 
    type: Message['type'] = 'text',
    media?: { uri: string; type: string; name: string } | Array<{ uri: string; type: string; name: string }>
  ) => {
    if (!conversationId) return;
    if (!content.trim() && !media) return;
    
    chatSocketService.emitStopTyping(conversationId);
    
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      _id: tempId,
      conversationId,
      sender: { _id: currentUserIdRef.current || 'me', displayName: 'You', fullName: 'You', avatar: null },
      content: content || (type === 'image' ? 'Sent an image' : type === 'audio' ? 'Sent a voice message' : ''),
      type,
      replyTo: replyingTo || undefined,
      createdAt: new Date().toISOString(),
      readBy: [],
      deliveredBy: [],
      isMe: true,
      status: 'sending',
      mediaUrl: Array.isArray(media) ? media[0]?.uri : media?.uri, // Show first local URI immediately
      mediaList: Array.isArray(media) ? media.map(m => ({ url: m.uri, publicId: 'temp', mediaType: type as any })) : [],
      mediaType: type as any,
    };

    setMessages(prev => [tempMessage, ...prev]);
    setReplyingTo(null);

    try {
      let finalMediaUrl = '';
      let finalPublicId = '';
      let finalMediaList: Array<{ url: string; publicId: string; mediaType: 'image' | 'audio' | 'video' }> = [];
      let finalContent = content;

      if (media) {
        if (Array.isArray(media)) {
          // Parallel upload
          const results = await Promise.all(media.map(m => chatRepository.uploadMedia(m.uri, m.name, m.type)));
          finalMediaList = results.map(r => ({ url: r.url, publicId: r.publicId, mediaType: r.type }));
          finalMediaUrl = finalMediaList[0]?.url;
          finalPublicId = finalMediaList[0]?.publicId;
        } else {
          // Single upload
          const uploadResult = await chatRepository.uploadMedia(media.uri, media.name, media.type);
          finalMediaUrl = uploadResult.url;
          finalPublicId = uploadResult.publicId;
          finalMediaList = [{ url: uploadResult.url, publicId: uploadResult.publicId, mediaType: uploadResult.type }];
        }

        // If it's just a media message without text, use a professional placeholder
        if (!finalContent) {
          if (type === 'image') finalContent = media && Array.isArray(media) && media.length > 1 ? `[${media.length} hình ảnh]` : '[Hình ảnh]';
          else if (type === 'audio') finalContent = '[Tin nhắn thoại]';
          else finalContent = '[Tệp đính kèm]';
        }
      }

      // 2. Save Message to DB
      const realMessage = await chatRepository.sendMessage(
        conversationId, 
        finalContent, 
        type, 
        replyingTo?._id,
        finalMediaList.length > 0 ? { 
          uri: finalMediaUrl, 
          type: type as any, 
          publicId: finalPublicId,
          mediaList: finalMediaList 
        } : undefined as any
      );

      // 3. Update UI
      setMessages(prev => prev.map(m => m._id === tempId ? { ...realMessage, isMe: true, status: 'sent' } : m));
    } catch (err) {
      console.error('Send message error:', err);
      // Update UI with error state for retry
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
    
    // 1. Pre-validation: Don't show optimistic UI if we already know it fails
    if (type === 'all') {
      const msg = messages.find(m => m._id === messageId);
      const twoHours = 2 * 60 * 60 * 1000;
      if (msg && (Date.now() - new Date(msg.createdAt).getTime() > twoHours)) {
        showToast('Không thể thu hồi tin nhắn sau 2 giờ', 'error');
        return;
      }
    }

    // 2. Optimistic UI
    if (type === 'all') {
      setMessages(prev => prev.map(m => 
        m._id === messageId ? { ...m, isRecalled: { status: true, by: userId || 'me', at: new Date().toISOString() } } : m
      ));
    } else {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    }

    try {
      await chatRepository.deleteMessage(messageId, type);
    } catch (err: any) {
      console.error('Delete message error:', err);
      // Rollback UI
      setMessages(previousMessages);
      
      // Toast notification for user
      const message = err.message || 'Không thể thực hiện tác vụ này';
      showToast(message, 'error');
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

  const toggleBlockStatus = async () => {
    if (!otherUserIdRef.current) return;
    try {
      if (blockedByMe) {
        await chatRepository.unblockUser(otherUserIdRef.current);
      } else {
        await chatRepository.blockUser(otherUserIdRef.current);
      }
    } catch (err) {
      console.error('Toggle block status error:', err);
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
      const targetState = !blockedByMe;
      await toggleBlockStatus();
      setBlockedByMe(targetState);
    },
    getMedia,
    blockedByMe,
    isBlockedByOther,
    replyingTo,
    setReplyingTo,
    otherUserStatus,
    setOtherUserStatus,
    formatLastActive,
    isPeerTyping,
    sendTypingStatus,
    markRead,
    otherUserLastReadId,
  };
};
