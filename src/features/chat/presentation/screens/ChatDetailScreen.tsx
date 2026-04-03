import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius as br } from '../../../../core/theme/spacing';
import { useChatDetail } from '../../application/hooks/useChatDetail';
import { useChatDetailUI } from '../../application/hooks/useChatDetailUI';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { ChatDetailHeader } from '../components/ChatDetail/ChatDetailHeader';
import { MessageActionModal } from '../components/MessageActionModal';
import { TypingIndicator } from '../components/TypingIndicator';
import { ChatMediaPreview } from '../components/shared/ChatMediaPreview';
import { EmptyState } from '../../../../shared/components/feedback/Empty/EmptyState';
import { LoadingOverlay } from '../../../../shared/components/feedback/Loading/LoadingOverlay';
import { Message } from '../../domain/types/chat.types';
import { CHAT_STRINGS } from '../../domain/constants/chat.constants';

export const ChatDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    conversationId, name, avatar, isOnline, otherUserId, lastActive,
    blockedByMe: initialBlockedByMe, isBlockedByOther: initialIsBlockedByOther
  } = route.params || {};

  const {
    messages,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    sendMessage,
    toggleReaction,
    deleteMessage,
    replyingTo,
    setReplyingTo,
    otherUserStatus,
    formatLastActive,
    isPeerTyping,
    sendTypingStatus,
    blockedByMe,
    isBlockedByOther,
    blockUser,
    otherUserLastReadId,
  } = useChatDetail(conversationId, {
    isOnline,
    otherUserId,
    lastActive,
    blockedByMe: initialBlockedByMe,
    isBlockedByOther: initialIsBlockedByOther
  });

  const {
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
  } = useChatDetailUI(messages);

  const isBlocked = blockedByMe || isBlockedByOther;

  const handleActionPress = async (action: 'reply' | 'copy' | 'report' | 'delete' | 'recall' | 'save') => {
    if (!selectedMessage) return;

    if (action === 'reply') setReplyingTo(selectedMessage);
    if (action === 'copy' && selectedMessage.content) copyToClipboard(selectedMessage.content);
    if (action === 'delete') await deleteMessage(selectedMessage._id, 'me');
    if (action === 'recall') await deleteMessage(selectedMessage._id, 'all');

    setReactionModalVisible(false);
    setSelectedMessage(null);
  };

  const renderMessageItem = ({ item, index }: { item: Message; index: number }) => {
    const newerMsg = messages[index - 1];
    const olderMsg = messages[index + 1];
    const currentSenderId = (item.sender as any)?._id || (item.sender as any)?.id;
    const newerSenderId = newerMsg ? (newerMsg.sender as any)?._id || (newerMsg.sender as any)?.id : null;
    const olderSenderId = olderMsg ? (olderMsg.sender as any)?._id || (olderMsg.sender as any)?.id : null;

    const isPrevSameSender = newerSenderId === currentSenderId;
    const isNextSameSender = olderSenderId === currentSenderId;

    let showDivider = false;
    if (!olderMsg) showDivider = true;
    else {
      const currentTime = new Date(item.createdAt).getTime();
      const olderTime = new Date(olderMsg.createdAt).getTime();
      if ((currentTime - olderTime) / 60000 > 60) showDivider = true;
    }

    const dividerDate = new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return (
      <View>
        {showDivider && (
          <View style={styles.dividerContainer}>
            <Text style={styles.dividerText}>{dividerDate}</Text>
          </View>
        )}
        <MessageBubble
          message={item}
          isPrevSameSender={isPrevSameSender}
          isNextSameSender={isNextSameSender}
          onLongPress={handleLongPress}
          onDoubleTap={(msg) => toggleReaction(msg._id, '❤️')}
          onReplyPress={(msg) => setReplyingTo(msg)}
          onImagePress={handleImagePress}
          isReadByOther={!!item._id && !!otherUserLastReadId && item._id.toString() <= otherUserLastReadId.toString()}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.borderDark} />
      <ChatDetailHeader
        name={name}
        avatar={avatar}
        isOnline={otherUserStatus.isOnline}
        lastActive={otherUserStatus.lastActive}
        isBlocked={isBlocked}
        onBack={() => navigation.goBack()}
        onInfo={() => (navigation as any).navigate('ChatInfo', { conversationId, userId: otherUserId, name, avatar, blockedByMe })}
        formatLastActive={formatLastActive}
      />

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
            ListHeaderComponent={isPeerTyping ? <TypingIndicator /> : <View style={{ height: spacing.sm }} />}
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={colors.textSecondary} style={styles.loader} /> : null}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyWrapper}>
                  <EmptyState
                    title={name}
                    subtitle={CHAT_STRINGS.chat_welcome}
                    emoji="👋"
                    actionLabel={CHAT_STRINGS.view_profile}
                    onActionPress={() => (navigation as any).navigate('MatchProfile', { id: otherUserId, name, avatar, conversationId })}
                  />
                </View>
              ) : null
            }
          />

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
              <Text style={styles.pillText}>{CHAT_STRINGS.new_message_pill}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {isBlocked ? (
          <View style={styles.blockedBanner}>
            <Text style={styles.blockedText}>
              {blockedByMe ? CHAT_STRINGS.blocked_me : CHAT_STRINGS.blocked_other}
            </Text>
            {blockedByMe && (
              <TouchableOpacity style={styles.unblockBtn} onPress={blockUser}>
                <Text style={styles.unblockBtnText}>{CHAT_STRINGS.unblock}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <ChatInput
            onSend={(content, type, media) => sendMessage(content, type, media)}
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
        onSelectEmoji={(emoji) => { toggleReaction(selectedMessage?._id!, emoji); setReactionModalVisible(false); }}
        onActionPress={handleActionPress}
        isMyMessage={selectedMessage?.isMe}
        isRecalled={selectedMessage?.isRecalled?.status}
        messageType={selectedMessage?.type}
      />

      <ChatMediaPreview
        visible={!!previewMedia}
        onClose={() => setPreviewMedia(null)}
        data={previewMedia?.list || []}
        initialIndex={previewMedia?.index || 0}
        onSave={() => { }}
      />

      <LoadingOverlay visible={loading && messages.length === 0} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  keyboardView: { flex: 1 },
  listWrapper: { flex: 1, position: 'relative' },
  listContent: { paddingVertical: spacing.md_sm },
  loader: { marginVertical: spacing.lg },
  dividerContainer: { alignItems: 'center', marginVertical: spacing.md, paddingHorizontal: spacing.lg },
  dividerText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', backgroundColor: colors.whiteOpacity10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  scrollDownWrapper: { position: 'absolute', bottom: spacing.md, left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  scrollDownPill: { backgroundColor: colors.surfaceHigh, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: br.full, elevation: 8, shadowColor: colors.bgDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  pillText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  blockedBanner: { padding: spacing.md, backgroundColor: colors.whiteOpacity10, borderTopWidth: 1, borderTopColor: colors.overlayBorder, alignItems: 'center' },
  blockedText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.sm },
  unblockBtn: { backgroundColor: colors.messengerBlue, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: 20 },
  unblockBtnText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  readStatusContainer: { alignItems: 'flex-end', paddingRight: spacing.sm, marginTop: -spacing.xs, marginBottom: spacing.md_sm },
  readAvatar: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.8, borderColor: colors.bgDark },
  emptyWrapper: { transform: [{ scaleY: -1 }, { scaleX: -1 }] },
});
