import { useState } from 'react';
import { Message } from '../../domain/types/chat-detail.types';
import { mockMessages } from '../../data/chat-detail.data';

export const useChatDetail = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(true); // Mock typing effect

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Me',
      senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASBQhT7NvVl5U2rpDhI_IDHLtP1fdBVFWlIYcjWZKHDm3MvCZJawMnsmwKzXxCsxbbxbfTMvNp6tDBg2jAfEh2JBfCkg0Pj6smPC9qobCKZChOUduPpzxe3hMwuyq-U7euPjZIngvWwz1Bnv_wDqTT-bl-OWrq8nkccjEhoPFI_jG65yHYtN8bQgRfj0TMWJNFTEHPnSagHgew77Lkj1nZYUOM7-_Zz7DF9T6RLJm8_nzkFn1saV-uuGvdS-yHVaiJA7YBdZsuQw',
      text,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      isMe: true,
    };
    setMessages([...messages, newMessage]);
  };

  return {
    messages,
    sendMessage,
    isTyping,
  };
};
