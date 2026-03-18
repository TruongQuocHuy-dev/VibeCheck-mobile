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
import { colors, gradients } from '../../../../core/theme/colors';
import { useChat } from '../../application/hooks/useChat';
import { ChatItem } from '../../domain/types/chat.types';
import { spacing, typography } from '../../../../core/theme';

export const ChatScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { chatList, handleChatPress, handleEdit } = useChat();

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item.id, item.name, item.avatar, item.isOnline)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {item.isGroup ? (
            <LinearGradient
              colors={[...(gradients.primary || ['#6C63FF', '#FF6B6B'])] as string[]}
              style={styles.groupAvatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.groupAvatarInner}>
                <Icon name="people" size={24} color="#FFFFFF" />
              </View>
            </LinearGradient>
          ) : (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          )}

          {item.isOnline && <View style={styles.onlineBadge} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.chatTime}>{item.time}</Text>
          </View>

          <View style={styles.messageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.isGroup && <Text style={styles.groupMessagePrefix}>Minh: </Text>}
              {item.lastMessage}
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark || '#0F0F1A'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>INBOX</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Icon name="create-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatList}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 90 + insets.bottom } // Avoid overlap with CustomTabBar
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark || '#0F0F1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(15, 15, 26, 0.95)', // Semi-transparent overlay
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
    paddingVertical: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  groupAvatarGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
  },
  groupAvatarInner: {
    flex: 1,
    borderRadius: 26,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#39FF14', // Neon Green
    borderWidth: 2,
    borderColor: '#121212',
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#A0A0B0',
    flex: 1,
    paddingRight: 16,
  },
  groupMessagePrefix: {
    color: '#00F0FF', // Neon Cyan
  },
  unreadBadge: {
    backgroundColor: '#FF0099', // Hot Neon Pink
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF0099',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  separator: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
