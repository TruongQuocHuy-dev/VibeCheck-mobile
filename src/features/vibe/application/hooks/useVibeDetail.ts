import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { useProfile } from '../../../../features/profile/application/hooks/useProfile';

type VibeDetailNav = NativeStackNavigationProp<RootStackParamList>;

type VibeDetailRouteParams = {
  userId: string;
  stories: any[];
  initialIndex?: number;
};

export const useVibeDetail = () => {
  const navigation = useNavigation<VibeDetailNav>();
  const route = useRoute();
  const { ownProfileData } = useProfile();
  const params = (route.params || {}) as VibeDetailRouteParams;
  const stories = params.stories || [];

  const [currentIndex, setCurrentIndex] = useState(params.initialIndex || 0);
  const [replyInput, setReplyInput] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  const detail = useMemo(() => {
    if (!currentStory) return null;
    
    return {
      id: currentStory.id || currentStory._id,
      caption: currentStory.caption || '',
      location: currentStory.location || null,
      expiresAt: currentStory.expiresAt,
      backgroundImage: currentStory.imageUrl || currentStory.backgroundImage,
      track: currentStory.music || null,
      ownerName: params.userId === 'me' 
        ? (ownProfileData?.fullName || ownProfileData?.displayName || 'Bạn') 
        : (currentStory.ownerName || 'Vibe User'),
      ownerAvatar: params.userId === 'me'
        ? (ownProfileData?.avatar)
        : (currentStory.ownerAvatar || 'https://via.placeholder.com/150'),
      stats: currentStory.stats || [],
      reactions: currentStory.reactions || [],
      comments: currentStory.comments || [],
    };
  }, [currentStory, params.userId, ownProfileData]);

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

  const handleSendReply = useCallback(() => {
    const text = replyInput.trim();

    if (!text) {
      return;
    }

    console.log('Send story reply', text);
    setReplyInput('');
  }, [replyInput]);

  const handleReactionPress = useCallback((reactionId: string) => {
    setSelectedReaction(reactionId);
  }, []);

  const handleProfilePress = useCallback(() => {
    console.log('Open vibe owner profile');
  }, []);

  const handleMenuPress = useCallback(() => {
    console.log('Vibe detail menu pressed');
  }, []);

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
    toggleMute: () => setIsMuted(prev => !prev),
    handlePressIn: () => setIsPaused(true),
    handlePressOut: () => setIsPaused(false),
  };
};
