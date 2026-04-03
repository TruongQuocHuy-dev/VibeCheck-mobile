import { useState, useRef, useEffect, useCallback } from 'react';
import { Animated, FlatList, NativeSyntheticEvent, NativeScrollEvent, Clipboard } from 'react-native';
import { Message } from '../../domain/types/chat.types';
import { useToast } from '../../../../shared/hooks/useToast';

export const useChatDetailUI = (messages: Message[]) => {
  const { showToast } = useToast();
  const flatListRef = useRef<FlatList>(null);
  const isAtBottomRef = useRef(true);
  const scrollBtnAnim = useRef(new Animated.Value(0)).current;

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ index: number; list: any[] } | null>(null);

  // Force Scroll to Bottom on Initial Load or new messages if we were at bottom
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        if (isAtBottomRef.current) {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  // Handle FAB animation
  useEffect(() => {
    Animated.spring(scrollBtnAnim, {
      toValue: showScrollToBottom ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [showScrollToBottom, scrollBtnAnim]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    // Inverted list: 0 is bottom. show button if we are scrolled up more than 300px
    const isAtBottom = contentOffset.y <= 100;
    const shouldShow = contentOffset.y > 300;
    
    if (shouldShow !== showScrollToBottom) {
      setShowScrollToBottom(shouldShow);
    }
    isAtBottomRef.current = isAtBottom;
  };

  const jumpToBottom = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setShowScrollToBottom(false);
    isAtBottomRef.current = true;
  };

  const handleImagePress = (index: number, list: any[]) => {
    setPreviewMedia({ index, list });
  };

  const handleLongPress = (message: Message) => {
    setSelectedMessage(message);
    setReactionModalVisible(true);
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    showToast('Đã sao chép tin nhắn', 'success');
  };

  return {
    flatListRef,
    scrollBtnAnim,
    selectedMessage,
    setSelectedMessage,
    reactionModalVisible,
    setReactionModalVisible,
    showScrollToBottom,
    previewMedia,
    setPreviewMedia,
    handleScroll,
    jumpToBottom,
    handleImagePress,
    handleLongPress,
    copyToClipboard,
  };
};
