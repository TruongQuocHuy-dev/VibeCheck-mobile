import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { useChatDetail } from '../../application/hooks/useChatDetail';
import { Message } from '../../domain/types/chat.types';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = (width - spacing.md * 2 - spacing.xs * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

export const ChatInfoScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { conversationId, userId, name, avatar, bio, blockedByMe: initialBlockedByMe } = route.params || {};

  const {
    getMedia,
    clearHistory,
    blockUser,
    blockedByMe,
  } = useChatDetail(conversationId, { 
    otherUserId: userId, 
    isOnline: false, 
    lastActive: null,
    blockedByMe: initialBlockedByMe
  });

  const handleViewProfile = () => {
    (navigation as any).navigate('MatchProfile', {
      id: userId,
      name: name,
      avatar: avatar,
      conversationId: conversationId,
    });
  };

  const [media, setMedia] = useState<Message[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [mediaPage, setMediaPage] = useState(1);
  const [hasMoreMedia, setHasMoreMedia] = useState(true);

  const fetchMediaData = useCallback(async (page: number) => {
    if (page > 1 && !hasMoreMedia) return;
    
    if (page === 1) setLoadingMedia(true);
    const data = await getMedia(page);
    
    if (data.length < 20) setHasMoreMedia(false);
    
    setMedia(prev => (page === 1 ? data : [...prev, ...data]));
    setLoadingMedia(false);
  }, [getMedia, hasMoreMedia]);

  useEffect(() => {
    fetchMediaData(1);
  }, []);

  const handleClearChat = () => {
    Alert.alert(
      'Xóa lịch sử trò chuyện',
      'Bạn có chắc chắn muốn xóa tất cả tin nhắn? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearHistory();
              // Navigate back to Chat list after clearing (deleting) chat (casting to any to avoid type complexity with nested screens)
              (navigation as any).navigate('Main', { screen: 'Chat' });
            } catch (err) {
              Alert.alert('Lỗi', 'Không thể xóa lịch sử trò chuyện.');
            }
          }
        },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      'Chặn người dùng',
      `Bạn sẽ không nhận được tin nhắn từ ${name} nữa.`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: blockedByMe ? 'Bỏ chặn' : 'Chặn', 
          style: 'destructive',
          onPress: async () => {
            try {
              await blockUser(); // useChatDetail's blockUser toggles blockedByMe
            } catch (err) {
              Alert.alert('Lỗi', 'Không thể thực hiện tác vụ.');
            }
          }
        },
      ]
    );
  };

  const renderMediaItem = ({ item }: { item: Message }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.mediaItem}>
      <Image source={{ uri: item.mediaUrl }} style={styles.mediaImage} />
      {item.type === 'video' && (
        <View style={styles.videoIconOverlay}>
          <Icon name="play" size={20} color={colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={28} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={media}
        keyExtractor={(item) => item._id}
        renderItem={renderMediaItem}
        numColumns={COLUMN_COUNT}
        ListHeaderComponent={
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={handleViewProfile}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
            </TouchableOpacity>
            <Text style={styles.name}>{name}</Text>
            {bio && <Text style={styles.bio}>{bio}</Text>}

            <TouchableOpacity style={styles.viewProfileMainBtn} onPress={handleViewProfile}>
              <Text style={styles.viewProfileMainText}>Xem trang cá nhân</Text>
            </TouchableOpacity>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleBlock}>
                <View style={[styles.iconBg, { backgroundColor: blockedByMe ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 69, 58, 0.1)' }]}>
                  <Icon name={blockedByMe ? 'checkmark-circle-outline' : 'close-circle-outline'} size={20} color={blockedByMe ? colors.neonGreen : colors.error} />
                </View>
                <Text style={[styles.actionLabel, { color: blockedByMe ? colors.neonGreen : colors.error }]}>
                  {blockedByMe ? 'Bỏ chặn' : 'Chặn'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={handleClearChat}>
                <View style={styles.iconBg}>
                  <Icon name="trash-outline" size={20} color={colors.white} />
                </View>
                <Text style={styles.actionLabel}>Xóa chat</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Phương tiện & Link</Text>
              {media.length > 0 && <Text style={styles.sectionCount}>{media.length}</Text>}
            </View>
          </View>
        }
        ListEmptyComponent={
          loadingMedia ? (
            <ActivityIndicator color={colors.messengerBlue} style={{ marginTop: spacing.xl }} />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="images-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyText}>Chưa có ảnh hoặc video nào</Text>
            </View>
          )
        }
        onEndReached={() => fetchMediaData(mediaPage + 1)}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    height: 56,
  },
  backButton: { padding: spacing.xs },
  headerTitle: { color: colors.white, fontSize: 17, fontWeight: 'bold' },
  listContent: { paddingBottom: spacing.xxl },
  profileSection: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.xl },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: spacing.md },
  name: { color: colors.white, fontSize: 22, fontWeight: 'bold', marginBottom: spacing.xs },
  bio: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', paddingHorizontal: spacing.xl },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.xxl,
  },
  actionBtn: { alignItems: 'center' },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  actionLabel: { color: colors.white, fontSize: 12, fontWeight: '500' },
  sectionHeader: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
  sectionCount: { color: colors.textSecondary, fontSize: 14 },
  columnWrapper: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  mediaItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginBottom: spacing.xs,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMedium,
  },
  mediaImage: { width: '100%', height: '100%' },
  videoIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: { alignItems: 'center', marginTop: spacing.xxl },
  emptyText: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.md },
  viewProfileMainBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  viewProfileMainText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
