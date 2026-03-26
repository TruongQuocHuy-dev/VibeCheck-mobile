import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMessages, sendMessageApi } from '../../data/chat.service';
import {
  joinConversation,
  leaveConversation,
  onSocketEvent,
  offSocketEvent,
} from '../../../../infrastructure/services/socket.service';
import type { Message } from '../../domain/types/chat.types';

interface ChatDetailParams {
  conversationId: string;
}

interface UseChatDetail {
  messages: Message[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => Promise<void>;
  loadMore: () => void;
}

export const useChatDetailV2 = ({
  conversationId,
}: ChatDetailParams): UseChatDetail => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [page, setPage] = useState(1);
  const hasMore = useRef(true);

  const loadMessages = useCallback(
    async (pageNum = 1) => {
      if (!hasMore.current && pageNum > 1) return;
      try {
        const data = await fetchMessages(conversationId, pageNum);
        if (data.length === 0) {
          hasMore.current = false;
          return;
        }
        setMessages((prev) => (pageNum === 1 ? data : [...data, ...prev]));
      } catch (err: any) {
        setError(err?.message ?? 'Không thể tải tin nhắn.');
      } finally {
        setLoading(false);
      }
    },
    [conversationId]
  );

  useEffect(() => {
    loadMessages(1);
    joinConversation(conversationId);

    const handleNewMessage = (payload: { conversationId: string; message: Message }) => {
      if (payload.conversationId === conversationId) {
        setMessages((prev) => [...prev, payload.message]);
      }
    };

    onSocketEvent<{ conversationId: string; message: Message }>('new_message', handleNewMessage);

    return () => {
      leaveConversation(conversationId);
      offSocketEvent<{ conversationId: string; message: Message }>('new_message', handleNewMessage);
    };
  }, [conversationId, loadMessages]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    setInputText('');
    setSending(true);
    try {
      await sendMessageApi(conversationId, text);
    } catch (err: any) {
      setError(err?.message ?? 'Gửi thất bại.');
      setInputText(text);
    } finally {
      setSending(false);
    }
  }, [conversationId, inputText, sending]);

  const loadMore = useCallback(() => {
    setPage((prev) => {
      const nextPage = prev + 1;
      loadMessages(nextPage);
      return nextPage;
    });
  }, [loadMessages]);

  return {
    messages,
    loading,
    sending,
    error,
    inputText,
    setInputText,
    handleSend,
    loadMore,
  };
};
