import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { colors, gradients } from '../../../../core/theme/colors';
import { useChat } from '../../application/hooks/useChat';
import { ConversationItem } from '../../domain/types/chat.types';
import { spacing } from '../../../../core/theme';

import { ChatActionModal } from '../components/ChatActionModal';
import { ChatItem } from '../components/ChatList/ChatItem';
import { EmptyState } from '../../../../shared/components/feedback/Empty/EmptyState';
import { CHAT_STRINGS } from '../../domain/constants/chat.constants';

import { MatchSelectModal } from '../components/MatchSelectModal';

export const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    chatList,
    loading,
    handleChatPress,
    refreshList,
    pinConversation,
    unpinConversation,
    markAsUnread,
    deleteConversation,
    blockUser,
    unblockUser,
    isMatchModalVisible,
    toggleMatchModal,
    handleMatchSelect,
  } = useChat();

  const [selectedChat, setSelectedChat] = useState<ConversationItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshList();
    }, [refreshList])
  );

  const handleLongPress = (item: ConversationItem) => {
    setSelectedChat(item);
    setModalVisible(true);
  };

  const handleAction = (action: 'pin' | 'unpin' | 'unread' | 'block' | 'delete') => {
    if (!selectedChat) return;

    switch (action) {
      case 'pin': pinConversation(selectedChat.id); break;
      case 'unpin': unpinConversation(selectedChat.id); break;
      case 'unread': markAsUnread(selectedChat.id); break;
      case 'delete': deleteConversation(selectedChat.id); break;
      case 'block':
        if (selectedChat.blockedByMe) unblockUser(selectedChat.user._id);
        else blockUser(selectedChat.user._id);
        break;
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={[colors.bgDark, 'transparent']}
        style={[styles.headerGradient]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{CHAT_STRINGS.inbox_title}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleMatchModal}>
              <Icon name="search" size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={toggleMatchModal}>
              <Icon name="create-outline" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={chatList}
        renderItem={({ item }) => (
          <ChatItem
            item={item}
            onPress={handleChatPress}
            onLongPress={handleLongPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 90 + insets.bottom }
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.messengerBlue} style={{ marginTop: spacing.xxl }} />
          ) : (
            <EmptyState
              title={CHAT_STRINGS.no_messages}
              subtitle={CHAT_STRINGS.start_swiping}
              emoji="💬"
              actionLabel={CHAT_STRINGS.find_new_friends}
              onActionPress={toggleMatchModal}
            />
          )
        }
      />

      <ChatActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAction={handleAction}
        isPinned={selectedChat?.isPinned ?? false}
        isBlocked={selectedChat?.blockedByMe ?? false}
        userName={selectedChat?.user?.fullName ?? ''}
      />

      <MatchSelectModal
        visible={isMatchModalVisible}
        onSelect={handleMatchSelect}
        onClose={toggleMatchModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  headerGradient: { zIndex: 10, backgroundColor: colors.bgDark },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Outfit-Bold',
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  headerActions: { flexDirection: 'row', gap: 12 },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.whiteOpacity10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  listContent: { paddingVertical: 8 },
  separator: { height: 1, backgroundColor: colors.bgTooltip, marginLeft: 96 },
});
