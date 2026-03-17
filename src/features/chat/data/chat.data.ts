import { ChatItem } from '../domain/types/chat.types';

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
  {
    id: '3',
    name: 'Hà Anh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Let\'s grab some coffee later!',
    time: '1h ago',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '4',
    name: 'Linh2003',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Check this out lol',
    time: '3h ago',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '5',
    name: 'KTX B Crew 🚀',
    avatar: '', // Group chat might use icon or gradient
    lastMessage: 'Minh: Who\'s down for dinner?',
    time: '5h ago',
    unreadCount: 0,
    isOnline: false,
    isGroup: true,
  },
];
