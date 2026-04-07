import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../../core/theme/colors';
import { ConversationItem } from '../../../domain/types/chat.types';
import { CHAT_STRINGS } from '../../../domain/constants/chat.constants';

interface ChatItemProps {
  item: ConversationItem;
  onPress: (
    conversationId: string, 
    name: string, 
    avatar: string | null, 
    isOnline?: boolean, 
    otherUserId?: string, 
    lastActive?: string | null,
    blockedByMe?: boolean,
    isBlockedByOther?: boolean
  ) => void;
  onLongPress: (item: ConversationItem) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({ item, onPress, onLongPress }) => {
  const isOnline = item.user?.isOnline;
  const fullName = item.user?.fullName || CHAT_STRINGS.unnamed_user;
  const avatar = item.user?.avatar || 'https://via.placeholder.com/150';

  let timeDisplay = '';
  if (item.lastMessageAt) {
    const d = new Date(item.lastMessageAt);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    if (isToday) {
      timeDisplay = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } else {
      timeDisplay = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
  }

  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onPress(
        item.id, 
        fullName, 
        avatar, 
        isOnline, 
        item.user?._id, 
        item.user?.lastActive,
        item.blockedByMe,
        item.isBlockedByOther
      )}
      onLongPress={() => onLongPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        {isOnline === true && <View style={styles.onlineBadge} />}
        {item.isPinned && (
          <View style={styles.pinnedIndicator}>
            <Icon name="pin" size={10} color={colors.white} />
          </View>
        )}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, item.isPinned && styles.chatNamePinned]} numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={styles.chatTime}>{timeDisplay}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.lastMessage, 
              item.unreadCount > 0 && styles.lastMessageUnread,
              item.lastMessage === CHAT_STRINGS.last_recalled && styles.lastMessageRecalled
            ]} 
            numberOfLines={1}
          >
            {item.lastMessage || CHAT_STRINGS.start_conversation}
          </Text>

          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.whiteOpacity10,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: colors.neonGreen,
    borderWidth: 3,
    borderColor: colors.bgDark,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    flex: 1,
    marginRight: 8,
  },
  chatNamePinned: {
    color: colors.messengerBlue,
  },
  chatTime: {
    fontSize: 12,
    color: colors.iconMuted,
  },
  pinnedIndicator: {
    position: 'absolute',
    top: -2,
    left: -2,
    backgroundColor: colors.messengerBlue,
    padding: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.bgDark,
    zIndex: 10,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textOpacity60,
    flex: 1,
    paddingRight: 16,
  },
  lastMessageUnread: {
    color: colors.white,
    fontWeight: '600',
  },
  lastMessageRecalled: {
    fontStyle: 'italic',
    color: colors.textOpacity60,
  },
  unreadBadge: {
    backgroundColor: colors.neonPink,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.white,
  },
});
