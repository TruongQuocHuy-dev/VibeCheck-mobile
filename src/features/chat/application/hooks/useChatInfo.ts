import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Message } from '../../domain/types/chat.types';
import { useChatDetail } from './useChatDetail';
import { useToast } from '../../../../shared/hooks/useToast';
import { useNavigation } from '@react-navigation/native';

const audioPlayerInstance = new AudioRecorderPlayer();

interface UseChatInfoProps {
  conversationId: string;
  userId: string;
  name: string;
  avatar: string | null;
  initialBlockedByMe?: boolean;
}

export const useChatInfo = ({
  conversationId,
  userId,
  name,
  avatar,
  initialBlockedByMe
}: UseChatInfoProps) => {
  const navigation = useNavigation();
  const { showToast } = useToast();
  
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
      // Backend returns all mediaTypes. Filter on frontend for tab separation
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
      showToast('Không thể tải dữ liệu', 'error');
    } finally {
      setLoadingMedia(false);
      setLoadingMore(false);
    }
  }, [getMedia, hasMoreMedia, loadingMore, showToast]);

  useEffect(() => {
    setMedia([]);
    setMediaPage(1);
    setHasMoreMedia(true);
    fetchMediaData(1, activeTab);
  }, [activeTab]);

  const handleViewProfile = () => {
    (navigation as any).navigate('MatchProfile', {
      id: userId,
      name: name,
      avatar: avatar,
      conversationId: conversationId,
    });
  };

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
              showToast('Đã xóa lịch sử trò chuyện', 'success');
              (navigation as any).navigate('Main', { screen: 'Chat' });
            } catch (err) {
              showToast('Không thể xóa lịch sử', 'error');
            }
          }
        },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      blockedByMe ? 'Bỏ chặn người dùng' : 'Chặn người dùng',
      blockedByMe ? `Bạn sẽ nhận được tin nhắn từ ${name} trở lại.` : `Bạn sẽ không nhận được tin nhắn từ ${name} nữa.`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: blockedByMe ? 'Bỏ chặn' : 'Chặn', 
          style: 'destructive',
          onPress: async () => {
            try {
              await blockUser();
              showToast(blockedByMe ? 'Đã bỏ chặn' : 'Đã chặn', 'success');
            } catch (err) {
              showToast('Không thể thực hiện tác vụ', 'error');
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
        const version = parseInt(Platform.Version.toString(), 10);
        if (version >= 33) {
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

  return {
    activeTab,
    setActiveTab,
    media,
    loadingMedia,
    loadingMore,
    fetchMore: () => fetchMediaData(mediaPage + 1, activeTab),
    handleViewProfile,
    handleClearChat,
    handleBlock,
    blockedByMe,
    previewVisible,
    setPreviewVisible,
    selectedIndex,
    setSelectedIndex,
    previewData,
    handlePreviewMedia,
    handleSaveToGallery,
    playingId,
    playTime,
    handleToggleAudio,
  };
};
