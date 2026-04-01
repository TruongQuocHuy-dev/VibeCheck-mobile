import { Message, ChatUser, ChatItem } from '../domain/types/chat.types';
export const REACTION_EMOJIS = ['❤️', '😆', '😮', '😢', '😡', '👍', '🔥', '👏'];

export const mockChatList: ChatItem[] = [
  {
    id: '1',
    name: 'Alex_Vibe',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Yo! That song you shared is fire 🔥',
    time: '2m ago',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Cyber_Cat',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Are you going to the library tonight?',
    time: '15m ago',
    unreadCount: 0,
    isOnline: true,
  },
];

export const mockUsers: Record<string, ChatUser> = {
  vibe_user: {
    _id: 'vibe_user_1',
    displayName: 'Alex_Vibe',
    fullName: 'Alex Vibe',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    lastActive: new Date().toISOString(),
  },
  me: {
    _id: 'me',
    displayName: 'You',
    fullName: 'You',
    avatar: 'https://via.placeholder.com/150',
  },
};

export const initialMockMessages: Message[] = [
  {
    _id: '1',
    conversationId: '1',
    sender: mockUsers.vibe_user,
    content: 'Yo! That song you shared is fire 🔥',
    type: 'text',
    readBy: ['me'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    reactions: [{ userId: 'me', emoji: '❤️', createdAt: new Date().toISOString() }],
  },
  {
    _id: '2',
    conversationId: '1',
    sender: mockUsers.me,
    content: 'Glad you liked it! It\'s really catchy.',
    type: 'text',
    readBy: ['vibe_user_1'],
    createdAt: new Date(Date.now() - 3500000).toISOString(),
    isMe: true,
    status: 'sent',
  },
];
