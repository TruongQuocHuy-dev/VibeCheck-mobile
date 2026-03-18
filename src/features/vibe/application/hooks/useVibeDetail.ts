import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { vibeDetailMockData } from '../../data/vibe-detail.data';

type VibeDetailNav = NativeStackNavigationProp<RootStackParamList>;

type VibeDetailRouteParams = {
  photoUrl?: string;
  caption?: string;
  location?: string;
  durationLabel?: string;
  trackTitle?: string;
  trackArtist?: string;
  ownerName?: string;
  ownerAvatar?: string;
  fromMatchStory?: boolean;
};

export const useVibeDetail = () => {
  const navigation = useNavigation<VibeDetailNav>();
  const route = useRoute();
  const params = (route.params || {}) as VibeDetailRouteParams;

  const [replyInput, setReplyInput] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const detail = useMemo(() => {
    return {
      ...vibeDetailMockData,
      caption: params.caption || vibeDetailMockData.caption,
      location: params.location || vibeDetailMockData.location,
      expiresIn: params.durationLabel ? `${params.durationLabel} còn lại` : vibeDetailMockData.expiresIn,
      backgroundImage: params.photoUrl || vibeDetailMockData.backgroundImage,
      track: {
        title: params.trackTitle || vibeDetailMockData.track.title,
        artist: params.trackArtist || vibeDetailMockData.track.artist,
      },
      ownerName: params.ownerName || 'Linh Chi',
      ownerAvatar:
        params.ownerAvatar ||
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
      isMatchStory: !!params.fromMatchStory,
    };
  }, [params.caption, params.durationLabel, params.fromMatchStory, params.location, params.ownerAvatar, params.ownerName, params.photoUrl, params.trackArtist, params.trackTitle]);

  const storySegments = useMemo(() => {
    const segmentCount = 4;

    return Array.from({ length: segmentCount }, (_, index) => ({
      id: `segment-${index}`,
      progress: index === 0 ? 1 : 0,
    }));
  }, []);

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
  };
};
