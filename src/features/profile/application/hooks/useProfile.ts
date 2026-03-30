import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { profileMockData } from '../../data/profile.data';
import { UserProfile } from '../../domain/types/profile.types';
import { getMatchProfileDetail } from '../../../matches/data/match-profile.data';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';

type ProfileNavigation = NativeStackNavigationProp<RootStackParamList>;

export const useProfile = () => {
  const navigation = useNavigation<ProfileNavigation>();
  const route = useRoute();

  const [ownProfileData, setOwnProfileData] = useState<any>(null);
  const [ownVibeStories, setOwnVibeStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const matchParams = (route.params || {}) as Partial<RootStackParamList['MatchProfile']>;
  const isMatchProfile = Boolean(matchParams.id && matchParams.name && matchParams.avatar);
  const isOwnProfile = !isMatchProfile;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, storiesRes]: any = await Promise.all([
        apiClient.get(ENDPOINTS.USER.GET_PROFILE),
        apiClient.get(ENDPOINTS.VIBE_STORIES.FEED),
      ]);
      setOwnProfileData(userRes?.user || userRes); // safely unwrap
      
      const userId = userRes?.user?._id || userRes?.id;
      const ownStoryGroup = (storiesRes.data?.data?.feed || []).find((group: any) => group.user.id === userId);
      setOwnVibeStories(ownStoryGroup ? ownStoryGroup.stories : []);
    } catch (err) {
      console.log('Error fetching profile or stories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOwnProfile) {
      const unsubscribe = navigation.addListener('focus', fetchProfile);
      fetchProfile(); // initial fetch
      return unsubscribe;
    }
  }, [isOwnProfile, navigation, fetchProfile]);

  const profile = useMemo<UserProfile>(() => {
    if (isMatchProfile) {
      const matchDetail = getMatchProfileDetail(matchParams.id as string);
      const displayName = (matchParams.name as string) || 'User';

      return {
        id: matchParams.id as string,
        username: `@${displayName}`,
        handle: displayName.toLowerCase().replace(/\s+/g, '.'),
        avatar: matchParams.avatar as string,
        isVerified: false,
        stats: [
          { id: 'stats-distance', label: 'Distance', value: matchDetail.distanceKm },
          { id: 'stats-vibes', label: 'Vibes', value: matchDetail.recentVibePhotos.length },
          { id: 'stats-likes', label: 'Likes', value: 0 },
          { id: 'stats-common', label: 'Common', value: matchDetail.interests.length },
        ],
        currentVibe: {
          id: `${matchDetail.id}-current-vibe`,
          text: matchDetail.bio,
          expiresIn: 'Con 12h',
          backgroundImage: matchDetail.recentVibePhotos[0] || profileMockData.currentVibe?.backgroundImage || '',
        },
        premiumPlan: profileMockData.premiumPlan,
        pastVibes: matchDetail.recentVibePhotos.map((image, index) => ({
          id: `${matchDetail.id}-photo-${index}`,
          image,
          statusLabel: 'Dang hoat dong',
        })),
      };
    }

    // fallback mapping for own profile
    if (!ownProfileData) return profileMockData; // render mock while loading or on failure

    const vibes = ownProfileData.vibes || [];
    const fullName = ownProfileData.fullName || ownProfileData.displayName || 'Người dùng';
    const nickname = ownProfileData.displayName ? `@${ownProfileData.displayName}` : `@user${ownProfileData.id?.slice(-4)}`;
    const avatar = ownProfileData.avatar || profileMockData.avatar;
    const bio = ownProfileData.bio || 'Sẵn sàng kết nối';

    return {
      ...profileMockData,
      id: ownProfileData._id || ownProfileData.id || profileMockData.id,
      username: fullName,
      handle: nickname,
      bio, 
      avatar,
      currentVibe: {
        id: 'current',
        text: bio,
        expiresIn: 'Mới cập nhật',
        backgroundImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600',
      },
      stats: [
        { id: 'stats-vibes', label: 'Vibes', value: vibes.length },
        ...profileMockData.stats.slice(1)
      ]
    };
  }, [isMatchProfile, matchParams, ownProfileData]);

  const hasStats = profile.stats.length > 0;
  const hasPastVibes = profile.pastVibes.length > 0;

  const statsTotal = useMemo(() => {
    return profile.stats.reduce((sum, stat) => sum + stat.value, 0);
  }, [profile.stats]);

  const handleSettingsPress = useCallback(() => {
    if (!isOwnProfile) {
      return;
    }

    navigation.navigate('Settings');
  }, [isOwnProfile, navigation]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEditAvatar = useCallback(() => {
    if (!isOwnProfile) {
      return;
    }

    console.log('Edit avatar pressed');
  }, [isOwnProfile]);

  const handleUpgradePress = useCallback(() => {
    if (!isOwnProfile) {
      return;
    }

    console.log('Upgrade premium pressed');
  }, [isOwnProfile]);

  const handleMessagePress = useCallback(() => {
    if (isOwnProfile || !matchParams.id || !matchParams.name || !matchParams.avatar) {
      return;
    }

    navigation.navigate('ChatDetail', {
      conversationId: matchParams.id,
      name: matchParams.name,
      avatar: matchParams.avatar,
      isOnline: Boolean(matchParams.isOnline),
    });
  }, [isOwnProfile, matchParams.avatar, matchParams.id, matchParams.isOnline, matchParams.name, navigation]);

  return {
    profile,
    loading,
    isOwnProfile,
    ownProfileData,
    hasStats,
    hasPastVibes,
    statsTotal,
    handleSettingsPress,
    handleBack,
    handleEditAvatar,
    handleUpgradePress,
    handleMessagePress,
    ownVibeStories,
    handleOwnStoryPress: () => {
      if (ownVibeStories.length > 0) {
        navigation.navigate('VibeDetail', {
          userId: ownProfileData?._id || ownProfileData?.id,
          stories: ownVibeStories,
          userName: 'Bạn',
          userAvatar: ownProfileData?.avatar,
        });
      }
    },
  };
};
