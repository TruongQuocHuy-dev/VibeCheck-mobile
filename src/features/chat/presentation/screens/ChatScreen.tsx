import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { colors, gradients } from '../../../../core/theme/colors';
import { useChat } from '../../application/hooks/useChat';
import { ConversationItem } from '../../domain/types/chat.types';
import { spacing, typography } from '../../../../core/theme';

export const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { chatList, loading, handleChatPress, handleEdit, refreshList } = useChat();

  // Refresh list whenever the screen comes into focus (e.g. back from detail)
  useFocusEffect(
    React.useCallback(() => {
      refreshList();
    }, [refreshList])
  );

  const renderChatItem = ({ item }: { item: ConversationItem }) => {
    const isOnline = item.user?.isOnline ?? false;
    const fullName = item.user?.fullName || 'Người dùng';
    const avatar = item.user?.avatar || 'https://via.placeholder.com/150';

    let timeDisplay = '';
    if (item.lastMessageAt) {
      const d = new Date(item.lastMessageAt);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();

      if (isToday) {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        timeDisplay = `${hours}:${minutes}`;
      } else {
        timeDisplay = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      }
    }

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item.id, fullName, avatar, isOnline, item.user?._id, item.user?.lastActive)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          {isOnline && <View style={styles.onlineBadge} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {fullName}
            </Text>
            <Text style={styles.chatTime}>{timeDisplay}</Text>
          </View>

          <View style={styles.messageRow}>
            <Text 
              style={[
                styles.lastMessage, 
                item.unreadCount > 0 && styles.lastMessageUnread,
                item.lastMessage === 'Tin nhắn đã được thu hồi' && styles.lastMessageRecalled
              ]} 
              numberOfLines={1}
            >
              {item.lastMessage || 'Bắt đầu cuộc trò chuyện'}
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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon name="chatbubbles-outline" size={60} color="rgba(255, 255, 255, 0.1)" />
      </View>
      <Text style={styles.emptyTitle}>Chưa có tin nhắn</Text>
      <Text style={styles.emptySubtitle}>
        Hãy bắt đầu quẹt để tìm thấy những người cùng vibe với bạn nhé!
      </Text>
      <TouchableOpacity style={styles.emptyCta} onPress={handleEdit}>
        <LinearGradient
          colors={[...gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>Tìm bạn mới</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient
        colors={[colors.bgDark, 'transparent']}
        style={[styles.headerGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hộp thư</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="search" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <Icon name="create-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {chatList.length === 0 && !loading ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={chatList}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 90 + insets.bottom }
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  headerGradient: {
    zIndex: 10,
    backgroundColor: colors.bgDark,
  },
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  listContent: {
    paddingVertical: 8,
  },
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: colors.overlayLight,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#39FF14', // Neon Green
    borderWidth: 3,
    borderColor: colors.bgDark,
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
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
    fontFamily: 'Outfit-SemiBold',
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'Outfit-Regular',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    flex: 1,
    paddingRight: 16,
    fontFamily: 'Outfit-Regular',
  },
  lastMessageUnread: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontFamily: 'Outfit-Medium',
  },
  lastMessageRecalled: {
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  unreadBadge: {
    backgroundColor: colors.neonPink,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neonPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Outfit-Bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginLeft: 96,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyCta: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  ctaGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700',
  },
});
