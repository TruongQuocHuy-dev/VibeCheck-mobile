import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius as br } from '../../../../core/theme/spacing';
import { useChatDetail } from '../../application/hooks/useChatDetail';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { MessageActionModal } from '../components/MessageActionModal';
import { TypingIndicator } from '../components/TypingIndicator';
import { Message } from '../../domain/types/chat.types';

export const ChatDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { conversationId, name, avatar, isOnline, otherUserId, lastActive, blockedByMe: initialBlockedByMe, isBlockedByOther: initialIsBlockedByOther } = route.params || {};

  const {
    messages,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    sendMessage,
    toggleReaction,
    deleteMessage,
    clearHistory,
    replyingTo,
    setReplyingTo,
    otherUserStatus,
    formatLastActive,
    isPeerTyping,
    sendTypingStatus,
    blockedByMe,
    isBlockedByOther,
    blockUser,
  } = useChatDetail(conversationId, { 
    isOnline, 
    otherUserId, 
    lastActive, 
    blockedByMe: initialBlockedByMe,
    isBlockedByOther: initialIsBlockedByOther
  });

  const isBlocked = blockedByMe || isBlockedByOther;

  const flatListRef = useRef<FlatList>(null);
  const isAtBottomRef = useRef(true);
  const scrollBtnAnim = useRef(new Animated.Value(0)).current;

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Force Scroll to Bottom on Initial Load
  useEffect(() => {
    if (!loading && messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading, messages.length > 0]); 

  // Handle FAB animation
  useEffect(() => {
    Animated.spring(scrollBtnAnim, {
      toValue: showScrollToBottom ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [showScrollToBottom, scrollBtnAnim]);

  const formatDividerDate = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return timeStr;
    if (isYesterday) return `Hôm qua, ${timeStr}`;
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    const isAtBottom = contentOffset.y <= 100;
    if (isAtBottom && showScrollToBottom) setShowScrollToBottom(false);
    isAtBottomRef.current = isAtBottom;
  };

  const jumpToBottom = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    setShowScrollToBottom(false);
  };

  const handleLongPress = (message: Message) => {
    setSelectedMessage(message);
    setReactionModalVisible(true);
  };

  const onSelectEmoji = (emoji: string) => {
    if (selectedMessage) {
      toggleReaction(selectedMessage._id, emoji);
      setReactionModalVisible(false);
      setSelectedMessage(null);
    }
  };

  const handleActionPress = async (action: 'reply' | 'copy' | 'report' | 'delete' | 'recall') => {
    if (!selectedMessage) return;
    
    try {
      if (action === 'reply') setReplyingTo(selectedMessage);
      if (action === 'delete') {
        await deleteMessage(selectedMessage._id, 'me');
      }
      if (action === 'recall') {
        await deleteMessage(selectedMessage._id, 'all');
      }
    } catch (err) {
      // Error handled in hook (rollback + console)
    } finally {
      setReactionModalVisible(false);
      setSelectedMessage(null);
    }
  };

  const goToInfo = () => {
    (navigation as any).navigate('ChatInfo', {
      conversationId,
      userId: otherUserId,
      name,
      avatar,
      blockedByMe,
    });
  };

  const handleViewProfile = () => {
    (navigation as any).navigate('MatchProfile', {
      id: otherUserId,
      name,
      avatar,
      conversationId,
    });
  };

  const renderMessageItem = ({ item, index }: { item: Message; index: number }) => {
    const newerMsg = messages[index - 1];
    const olderMsg = messages[index + 1];
    const currentSenderId = typeof item.sender === 'string' ? item.sender : (item.sender as any)?._id || (item.sender as any)?.id;
    const newerSenderId = newerMsg ? (typeof newerMsg.sender === 'string' ? newerMsg.sender : (newerMsg.sender as any)?._id || (newerMsg.sender as any)?.id) : null;
    const olderSenderId = olderMsg ? (typeof olderMsg.sender === 'string' ? olderMsg.sender : (olderMsg.sender as any)?._id || (olderMsg.sender as any)?.id) : null;

    const isPrevSameSender = newerSenderId === currentSenderId;
    const isNextSameSender = olderSenderId === currentSenderId;

    let showDivider = false;
    if (!olderMsg) showDivider = true;
    else {
      const currentTime = new Date(item.createdAt).getTime();
      const olderTime = new Date(olderMsg.createdAt).getTime();
      if ((currentTime - olderTime) / 60000 > 60) showDivider = true;
    }

    return (
      <View>
        {showDivider && (
          <View style={styles.dividerContainer}>
            <Text style={styles.dividerText}>{formatDividerDate(item.createdAt)}</Text>
          </View>
        )}
        <MessageBubble
          message={item}
          isPrevSameSender={isPrevSameSender}
          isNextSameSender={isNextSameSender}
          onLongPress={handleLongPress}
          onDoubleTap={(msg) => toggleReaction(msg._id, '❤️')}
          onReplyPress={(msg) => setReplyingTo(msg)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.borderDark} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.headerAvatar} />
            {otherUserStatus.isOnline && !isBlocked && <View style={styles.onlineBadge} />}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{name}</Text>
            {!isBlocked && (
              <Text style={[styles.headerStatus, otherUserStatus.isOnline && styles.headerStatusOnline]}>
                {otherUserStatus.isOnline ? 'Đang hoạt động' : formatLastActive(otherUserStatus.lastActive)}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={goToInfo}>
            <Icon name="information-circle-outline" size={26} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={styles.listWrapper}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            inverted
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
            ListHeaderComponent={
              isPeerTyping ? <TypingIndicator /> : <View style={{ height: spacing.sm }} />
            }
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color={colors.textSecondary} style={styles.loader} />
              ) : hasMore === false && messages.length > 0 ? (
                <Text style={styles.noMoreText}>Đầu cuộc hội thoại</Text>
              ) : null
            }
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <Image source={{ uri: avatar || 'https://ui-avatars.com/api/?name=User' }} style={styles.emptyAvatar} />
                  <Text style={styles.emptyTitle}>{name}</Text>
                  <Text style={styles.emptySubtitle}>Các bạn đã kết nối trên VibeCheck</Text>
                  <TouchableOpacity style={styles.viewProfileBtn} onPress={handleViewProfile}>
                    <Text style={styles.viewProfileText}>Xem trang cá nhân</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />

          {loading && (
            <View style={styles.initialLoader}>
              <ActivityIndicator size="large" color={colors.messengerBlue} />
            </View>
          )}

          <Animated.View 
            style={[
              styles.scrollDownWrapper,
              {
                opacity: scrollBtnAnim,
                transform: [{ translateY: scrollBtnAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
              }
            ]}
          >
            <TouchableOpacity style={styles.scrollDownPill} onPress={jumpToBottom} activeOpacity={0.8}>
              <View style={styles.pillIconBg}><Icon name="arrow-down" size={14} color={colors.white} /></View>
              <Text style={styles.pillText}>Tin nhắn mới</Text>
              <View style={styles.unreadBadgeMini} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {blockedByMe ? (
          <View style={styles.blockedBanner}>
            <Text style={styles.blockedText}>Bạn đã chặn người dùng này. Bỏ chặn để nhắn tin.</Text>
            <TouchableOpacity style={styles.unblockBtn} onPress={blockUser}>
              <Text style={styles.unblockBtnText}>Bỏ chặn</Text>
            </TouchableOpacity>
          </View>
        ) : isBlockedByOther ? (
          <View style={styles.blockedBanner}>
            <Text style={styles.blockedText}>Người này hiện không thể liên lạc được trên VibeCheck.</Text>
          </View>
        ) : (
          <ChatInput
            onSend={(content) => sendMessage(content)}
            onTyping={(status) => sendTypingStatus(status)}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            bottomInset={insets.bottom}
          />
        )}
      </KeyboardAvoidingView>

      <MessageActionModal
        visible={reactionModalVisible}
        onClose={() => setReactionModalVisible(false)}
        onSelectEmoji={onSelectEmoji}
        onActionPress={handleActionPress}
        isMyMessage={selectedMessage?.isMe}
        isRecalled={selectedMessage?.isRecalled?.status}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  keyboardView: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md_sm, height: 56, borderBottomWidth: 0.5, borderBottomColor: colors.surfaceHigh },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: { padding: spacing.xs, marginRight: spacing.sm },
  headerAvatar: { width: 32, height: 32, borderRadius: 16 },
  avatarContainer: { position: 'relative', marginRight: spacing.sm_md },
  onlineBadge: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.neonGreen, borderWidth: 2, borderColor: colors.bgDark, shadowColor: colors.neonGreen, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4, elevation: 4 },
  headerInfo: { justifyContent: 'center' },
  headerName: { color: colors.white, fontSize: 15, fontWeight: 'bold' },
  headerStatus: { color: colors.textSecondary, fontSize: 11 },
  headerStatusOnline: { color: colors.neonGreen, fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerIcon: { padding: 2 },
  listWrapper: { flex: 1, position: 'relative' },
  listContent: { paddingVertical: spacing.md_sm },
  initialLoader: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.bgDark, justifyContent: 'center', alignItems: 'center', zIndex: 200 },
  loader: { marginVertical: spacing.lg },
  noMoreText: { color: colors.textSecondary, fontSize: 12, textAlign: 'center', marginVertical: spacing.lg, opacity: 0.6 },
  dividerContainer: { alignItems: 'center', marginVertical: spacing.md, paddingHorizontal: spacing.lg },
  dividerText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  scrollDownWrapper: { position: 'absolute', bottom: spacing.md, left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  scrollDownPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceHigh, paddingLeft: spacing.xs, paddingRight: spacing.md, paddingVertical: spacing.xs, borderRadius: br.full, borderWidth: 1, borderColor: colors.surfacePill, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  pillIconBg: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.messengerBlue, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  pillText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  unreadBadgeMini: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.messengerBlue, marginLeft: spacing.xs },
  emptyContainer: { alignItems: 'center', paddingTop: spacing.xxl, paddingHorizontal: spacing.xxl, transform: [{ rotate: '180deg' }] },
  emptyAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: spacing.md },
  emptyTitle: { color: colors.white, fontSize: 20, fontWeight: 'bold', marginBottom: spacing.xs },
  emptySubtitle: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: spacing.lg },
  viewProfileBtn: { backgroundColor: colors.surfaceHigh, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: br.sm },
  viewProfileText: { color: colors.white, fontWeight: 'bold', fontSize: 14 },
  blockedBanner: { 
    padding: spacing.md, 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderTopWidth: 1, 
    borderTopColor: 'rgba(255, 255, 255, 0.1)', 
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
  },
  blockedText: { 
    fontSize: 13, 
    color: 'rgba(255, 255, 255, 0.5)', 
    textAlign: 'center', 
    marginBottom: spacing.sm, 
    fontFamily: 'Outfit-Regular' 
  },
  unblockBtn: { 
    backgroundColor: colors.messengerBlue, 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.xs, 
    borderRadius: 20 
  },
  unblockBtnText: { 
    color: colors.white, 
    fontSize: 14, 
    fontFamily: 'Outfit-SemiBold' 
  },
});
