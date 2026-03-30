import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { useProfile } from '../../../../features/profile/application/hooks/useProfile';
import { Alert } from 'react-native';
import { useToast } from '../../../../shared/hooks/useToast';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { VibeStory, VibeInteraction, VibeDetailData } from '../../domain/types/vibe-detail.types';

type VibeDetailNav = NativeStackNavigationProp<RootStackParamList>;

type VibeDetailRouteParams = {
  userId: string;
  stories: VibeStory[];
  initialIndex?: number;
  userName?: string;
  userAvatar?: string;
};

export const useVibeDetail = () => {
  const navigation = useNavigation<VibeDetailNav>();
  const route = useRoute();
  const { ownProfileData } = useProfile();
  const { showToast } = useToast();
  
  const myId = useMemo(() => ownProfileData?._id || ownProfileData?.id, [ownProfileData]);
  const params = (route.params || {}) as VibeDetailRouteParams;
  const stories = params.stories || [];

  const [currentIndex, setCurrentIndex] = useState(params.initialIndex || 0);
  const [replyInput, setReplyInput] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [interactions, setInteractions] = useState<VibeInteraction[]>([]);
  const [viewCount, setViewCount] = useState(0);
  const [isInteractionsLoading, setIsInteractionsLoading] = useState(false);
  const [showInteractions, setShowInteractions] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const storyTimer = useRef<any>(null);

  const currentStory = stories[currentIndex] || null;
  const hasMusic = !!(currentStory?.music?.previewUrl);
  const storyDuration = hasMusic ? 20000 : 15000;

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      progressAnim.setValue(0);
    } else {
      navigation.goBack();
    }
  }, [currentIndex, stories.length, navigation, progressAnim]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      progressAnim.setValue(0);
    }
  }, [currentIndex, progressAnim]);

  useEffect(() => {
    if (!currentStory || isPaused) {
      progressAnim.stopAnimation();
      if (storyTimer.current) clearTimeout(storyTimer.current);
      return;
    }

    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: storyDuration,
      useNativeDriver: false,
    }).start();

    storyTimer.current = setTimeout(() => {
      handleNext();
    }, storyDuration);

    return () => {
      if (storyTimer.current) clearTimeout(storyTimer.current);
    };
  }, [currentIndex, currentStory, isPaused, handleNext, progressAnim, storyDuration]);

  const isOwner = useMemo(() => {
    return params.userId === 'me' || params.userId === myId;
  }, [params.userId, myId]);

  const fetchInteractions = useCallback(async () => {
    if (!currentStory || !isOwner) return;

    setIsInteractionsLoading(true);
    try {
      const storyId = (currentStory.id || currentStory._id || '').toString();
      const response: any = await apiClient.get(ENDPOINTS.VIBE_STORIES.INTERACTIONS(storyId));
      setInteractions(response.interactions || []);
      setViewCount(response.viewCount || 0);
    } catch (e) {
      console.log('Fetch interactions error:', e);
    } finally {
      setIsInteractionsLoading(false);
    }
  }, [currentStory, isOwner]);

  const recordView = useCallback(async () => {
    if (!currentStory || isOwner) return;
    try {
      const storyId = (currentStory.id || currentStory._id || '').toString();
      await apiClient.post(ENDPOINTS.VIBE_STORIES.VIEW(storyId));
    } catch (e) {
      console.log('Record view error:', e);
    }
  }, [currentStory, isOwner]);

  useEffect(() => {
    if (isOwner) {
      fetchInteractions();
    } else {
      setInteractions([]);
      recordView();
    }
  }, [currentIndex, isOwner, fetchInteractions, recordView]);

  const detail: VibeDetailData | null = useMemo(() => {
    if (!currentStory) return null;
    
    // Check if viewing own story
    const isOwnerAction = params.userId === 'me' || params.userId === myId;

    return {
      id: (currentStory.id || currentStory._id || '').toString(),
      caption: currentStory.caption || '',
      location: currentStory.location || null,
      expiresAt: currentStory.expiresAt,
      backgroundImage: (currentStory.imageUrl || currentStory.backgroundImage || '').toString(),
      track: currentStory.music || null,
      ownerName: isOwnerAction 
        ? (ownProfileData?.fullName || ownProfileData?.displayName || 'Bạn') 
        : (params.userName || currentStory.ownerName || 'Vibe User'),
      ownerAvatar: isOwnerAction
        ? (ownProfileData?.avatar || '')
        : (params.userAvatar || currentStory.ownerAvatar || 'https://via.placeholder.com/150'),
      stats: (currentStory as any).stats || [],
      reactions: (currentStory as any).reactions || [],
      comments: (currentStory as any).comments || [],
    };
  }, [currentStory, params.userId, myId, ownProfileData, params.userName, params.userAvatar]);

  const storySegments = useMemo(() => {
    return stories.map((_, index) => ({
      id: `segment-${index}`,
      index,
    }));
  }, [stories]);

  const quickReactions = useMemo(() => {
    return [
      { id: 'heart', icon: 'heart' as const },
      { id: 'fire', icon: 'flame' as const },
      { id: 'wow', icon: 'sparkles' as const },
      { id: 'laugh', icon: 'happy' as const },
    ];
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSendReply = useCallback(async () => {
    const text = replyInput.trim();
    if (!text || !currentStory) return;

    // Không gửi nếu là story của bản thân
    if (params.userId === 'me' || params.userId === myId) {
      showToast('Không thể trả lời Vibe của chính mình', 'info');
      return;
    }

    try {
      const storyId = (currentStory.id || currentStory._id || '').toString();
      console.log(`[VibeDetail] Sending reply to storyId: ${storyId}`);
      await apiClient.post(ENDPOINTS.VIBE_STORIES.REPLY(storyId), { content: text });
      setReplyInput('');
      showToast('Đã trả lời Vibe', 'success');
    } catch (e: any) {
      console.error('[VibeDetail] Reply error:', e);
      showToast(e.response?.data?.message || 'Không thể gửi tin nhắn', 'error');
    }
  }, [replyInput, currentStory, showToast, params.userId]);

  const emotionMap: Record<string, string> = {
    heart: '❤️',
    fire: '🔥',
    wow: '😮',
    laugh: '😂',
  };

  const handleReactionPress = useCallback(async (reactionId: string) => {
    if (!currentStory) return;
    
    // Không gửi nếu là story của bản thân
    if (params.userId === 'me' || params.userId === myId) {
      showToast('Bạn không thể tương tác Vibe của chính mình', 'info');
      return;
    }

    const emoji = emotionMap[reactionId] || '👍';
    setSelectedReaction(reactionId);
    
    try {
      const storyId = (currentStory.id || currentStory._id || '').toString();
      console.log(`[VibeDetail] Sending interaction (reaction) to storyId: ${storyId}`);
      await apiClient.post(ENDPOINTS.VIBE_STORIES.REACT(storyId), { content: emoji });
      showToast('Đã gửi biểu cảm', 'success');
      setTimeout(() => setSelectedReaction(null), 1500);
    } catch (e: any) {
      console.error('[VibeDetail] Reaction error:', e);
      showToast(e.response?.data?.message || 'Lỗi gửi biểu cảm', 'error');
      setSelectedReaction(null);
    }
  }, [currentStory, showToast, params.userId]);

  const handleProfilePress = useCallback(() => {
    console.log('Open vibe owner profile');
  }, []);

  const handleMenuPress = useCallback(() => {
    const isOwner = params.userId === 'me' || params.userId === myId;

    if (isOwner) {
      Alert.alert(
        'Tùy chọn',
        'Bạn muốn làm gì với Vibe này?',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xóa Vibe',
            style: 'destructive',
            onPress: async () => {
              if (!currentStory) return;
              try {
                const storyId = (currentStory.id || currentStory._id || '').toString();
                await apiClient.delete(ENDPOINTS.VIBE_STORIES.DELETE(storyId));
                showToast('Đã xóa Vibe', 'success');
                navigation.goBack();
              } catch (e: any) {
                showToast(e.response?.data?.message || 'Không thể xóa Vibe', 'error');
              }
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert('Tùy chọn', 'Bạn muốn làm gì?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Báo cáo Vibe',
          style: 'destructive',
          onPress: () => showToast('Đã gửi báo cáo', 'success'),
        },
      ]);
    }
  }, [currentStory, params.userId, ownProfileData?.id, navigation, showToast]);

  return {
    detail,
    storySegments,
    quickReactions,
    replyInput,
    selectedReaction,
    setReplyInput,
    handleBack,
    handleProfilePress,
    handleMenuPress,
    handleSendReply,
    handleReactionPress,
    currentIndex,
    stories,
    currentStory,
    progressAnim,
    handleNext,
    handlePrev,
    isMuted,
    isNextDisabled: currentIndex === stories.length - 1,
    isOwner,
    interactions,
    viewCount,
    isInteractionsLoading,
    showInteractions,
    setShowInteractions,
    fetchInteractions,
    toggleMute: () => setIsMuted(prev => !prev),
    handlePressIn: () => setIsPaused(true),
    handlePressOut: () => setIsPaused(false),
  };
};
