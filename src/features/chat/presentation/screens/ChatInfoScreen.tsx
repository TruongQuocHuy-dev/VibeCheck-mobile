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
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { PermissionsAndroid, Platform, Modal } from 'react-native';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { useChatDetail } from '../../application/hooks/useChatDetail';
import { Message } from '../../domain/types/chat.types';
import { useToast } from '../../../../shared/hooks/useToast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = (SCREEN_WIDTH - spacing.md * 2 - spacing.xs * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

const audioPlayerInstance = new AudioRecorderPlayer();

export const ChatInfoScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { showToast } = useToast();
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

  const [activeTab, setActiveTab] = useState<'media' | 'voice'>('media');
  const [media, setMedia] = useState<Message[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mediaPage, setMediaPage] = useState(1);
  const [hasMoreMedia, setHasMoreMedia] = useState(true);

  // Preview States
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewData, setPreviewData] = useState<Message[]>([]);

  // Audio States
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playTime, setPlayTime] = useState('00:00');

  const fetchMediaData = useCallback(async (page: number, currentTab: 'media' | 'voice') => {
    if (page > 1 && (!hasMoreMedia || loadingMore)) return;
    
    if (page === 1) setLoadingMedia(true);
    else setLoadingMore(true);

    try {
      const data = await getMedia(page);
      // Backend returns all mediaTypes. We filter on frontend for simplicity unless we want dedicated endpoints.
      const filtered = data.filter(m => 
        currentTab === 'media' ? ['image', 'video'].includes(m.type) : m.type === 'audio'
      );

      if (data.length < 20) setHasMoreMedia(false);
      
      setMedia(prev => {
        if (page === 1) return filtered;
        const existingIds = new Set(prev.map(m => m._id));
        const newItems = filtered.filter(m => !existingIds.has(m._id));
        return [...prev, ...newItems];
      });
      setMediaPage(page);
    } catch (err) {
      console.error('Fetch media error:', err);
    } finally {
      setLoadingMedia(false);
      setLoadingMore(false);
    }
  }, [getMedia, hasMoreMedia, loadingMore]);

  useEffect(() => {
    setMedia([]);
    setMediaPage(1);
    setHasMoreMedia(true);
    fetchMediaData(1, activeTab);
  }, [activeTab]);

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
              await blockUser();
            } catch (err) {
              Alert.alert('Lỗi', 'Không thể thực hiện tác vụ.');
            }
          }
        },
      ]
    );
  };

  const handlePreviewMedia = (index: number) => {
    setPreviewData(media);
    setSelectedIndex(index);
    setPreviewVisible(true);
  };

  const handleSaveToGallery = async (uri: string) => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const res = await PermissionsAndroid.request('android.permission.READ_MEDIA_IMAGES');
          if (res !== 'granted') throw new Error('Cần quyền truy cập thư viện');
        } else {
          const res = await PermissionsAndroid.request('android.permission.WRITE_EXTERNAL_STORAGE');
          if (res !== 'granted') throw new Error('Cần quyền lưu trữ');
        }
      }

      const { default: ReactNativeBlobUtil } = await import('react-native-blob-util');
      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'jpg',
      }).fetch('GET', uri);

      const { CameraRoll } = await import('@react-native-camera-roll/camera-roll');
      const path = res.path();
      await CameraRoll.saveAsset(`file://${path}`, { type: 'photo' });
      await ReactNativeBlobUtil.fs.unlink(path);
      showToast('Đã lưu ảnh vào thư viện', 'success');
    } catch (err: any) {
      showToast(err.message || 'Không thể lưu ảnh', 'error');
    }
  };

  const handleToggleAudio = async (message: Message) => {
    if (playingId === message._id) {
      await audioPlayerInstance.stopPlayer();
      audioPlayerInstance.removePlayBackListener();
      setPlayingId(null);
    } else {
      try {
        if (playingId) {
          await audioPlayerInstance.stopPlayer();
        }
        setPlayingId(message._id);
        await audioPlayerInstance.startPlayer(message.mediaUrl);
        audioPlayerInstance.addPlayBackListener((e) => {
          setPlayTime(audioPlayerInstance.mmssss(Math.floor(e.currentPosition)));
          if (e.currentPosition === e.duration) {
            setPlayingId(null);
          }
        });
      } catch (err) {
        setPlayingId(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      audioPlayerInstance.stopPlayer();
      audioPlayerInstance.removePlayBackListener();
    };
  }, []);

  const renderMediaItem = ({ item, index }: { item: Message; index: number }) => {
    if (activeTab === 'media') {
      return (
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.mediaItem}
          onPress={() => handlePreviewMedia(index)}
        >
          <Image source={{ uri: item.mediaUrl }} style={styles.mediaImage} />
          {item.type === 'video' && (
            <View style={styles.videoIconOverlay}>
              <Icon name="play" size={20} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    // Voice item
    const isPlaying = playingId === item._id;
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        style={styles.voiceItem}
        onPress={() => handleToggleAudio(item)}
      >
        <View style={[styles.voiceIconBg, isPlaying && { backgroundColor: colors.white }]}>
          <Icon name={isPlaying ? "pause" : "mic"} size={20} color={isPlaying ? colors.messengerBlue : colors.white} />
        </View>
        <View style={styles.voiceInfo}>
          <Text style={styles.voiceTitle}>{isPlaying ? 'Đang phát...' : 'Tin nhắn thoại'}</Text>
          <Text style={styles.voiceDate}>
            {isPlaying ? playTime : `${new Date(item.createdAt).toLocaleDateString()} ${new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </Text>
        </View>
        <Icon name="chevron-forward" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

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
        key={activeTab} // Force re-render when switching layouts
        data={media}
        keyExtractor={(item) => item._id}
        renderItem={renderMediaItem}
        numColumns={activeTab === 'media' ? COLUMN_COUNT : 1}
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
              <Text style={styles.sectionTitle}>Phương tiện ảnh và voice</Text>
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabBtn, activeTab === 'media' && styles.tabBtnActive]} 
                onPress={() => setActiveTab('media')}
              >
                <Text style={[styles.tabLabel, activeTab === 'media' && styles.tabLabelActive]}>Ảnh & Video</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabBtn, activeTab === 'voice' && styles.tabBtnActive]} 
                onPress={() => setActiveTab('voice')}
              >
                <Text style={[styles.tabLabel, activeTab === 'voice' && styles.tabLabelActive]}>Tin nhắn thoại</Text>
              </TouchableOpacity>
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
        onEndReached={() => fetchMediaData(mediaPage + 1, activeTab)}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={activeTab === 'media' ? styles.columnWrapper : undefined}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.messengerBlue} style={{ marginVertical: spacing.md }} /> : null}
      />

      <Modal visible={previewVisible} transparent animationType="fade">
        <View style={styles.previewContainer}>
          <TouchableOpacity 
            style={styles.previewOverlay} 
            activeOpacity={1} 
            onPress={() => setPreviewVisible(false)} 
          />
          <View style={styles.previewContent}>
            <FlatList
              data={previewData}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={selectedIndex}
              getItemLayout={(_, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.slide}>
                  <Image source={{ uri: item.mediaUrl }} style={styles.previewImage} resizeMode="contain" />
                </View>
              )}
            />
          </View>
          <TouchableOpacity 
            style={[styles.closePreview, { top: spacing.xl }]} 
            onPress={() => setPreviewVisible(false)}
          >
            <Icon name="close" size={28} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.closePreview, { top: spacing.xl, right: spacing.xl + 40 }]} 
            onPress={() => handleSaveToGallery(previewData[selectedIndex]?.mediaUrl || '')}
          >
            <Icon name="download-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </Modal>
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
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabBtnActive: {
    backgroundColor: colors.messengerBlue,
  },
  tabLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.white,
  },
  voiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginBottom: 1,
  },
  voiceIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.messengerBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  voiceDate: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  previewContent: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  closePreview: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
});
