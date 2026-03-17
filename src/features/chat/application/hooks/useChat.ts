import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChatItem } from '../../domain/types/chat.types';
import { mockChatList } from '../../data/chat.data';

export const useChat = () => {
  const [chatList, setChatList] = useState<ChatItem[]>(mockChatList);
  const navigation = useNavigation<any>();

  const handleSearch = (query: string) => {
    // Mock search filter
    const filtered = mockChatList.filter(chat => 
      chat.name.toLowerCase().includes(query.toLowerCase())
    );
    setChatList(filtered);
  };

  const handleEdit = () => {
    console.log('Edit pressed');
  };

  const handleChatPress = (chatId: string, name: string, avatar: string, isOnline: boolean) => {
    console.log(`Navigating to ChatDetail: ${chatId}`);
    navigation.navigate('ChatDetail', { chatId, name, avatar, isOnline });
  };

  return {
    chatList,
    handleSearch,
    handleEdit,
    handleChatPress,
  };
};
