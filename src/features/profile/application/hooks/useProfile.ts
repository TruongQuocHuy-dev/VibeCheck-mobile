import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { profileMockData } from '../../data/profile.data';
import { UserProfile } from '../../domain/types/profile.types';
import { getMatchProfileDetail } from '../../../matches/data/match-profile.data';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { ProfileService } from '../../../../infrastructure/services/profile.service';
import { chatSocketService } from '../../../chat/data/ChatSocketService';
import { chatRepository } from '../../../chat/data/ChatRepository';

type ProfileNavigation = NativeStackNavigationProp<RootStackParamList>;

export const useProfile = () => {
  const navigation = useNavigation<ProfileNavigation>();
  const route = useRoute();

  const [ownProfileData, setOwnProfileData] = useState<any>(null);
  const [matchProfileData, setMatchProfileData] = useState<any>(null);
  const [ownVibeStories, setOwnVibeStories] = useState<any[]>([]);
  const [vibeHistory, setVibeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBlockedByOther, setIsBlockedByOther] = useState(false);

  const matchParams = (route.params || {}) as Partial<RootStackParamList['MatchProfile']>;
  const isMatchProfile = Boolean(matchParams.id && matchParams.name && matchParams.avatar);
  const isOwnProfile = !isMatchProfile;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setIsBlockedByOther(false);
    try {
      if (isOwnProfile) {
        const [userRes, storiesRes]: any = await Promise.all([
          apiClient.get(ENDPOINTS.USER.GET_PROFILE),
          apiClient.get(ENDPOINTS.VIBE_STORIES.FEED),
        ]);
        setOwnProfileData(userRes?.user || userRes);
        
        const userId = userRes?.user?._id || userRes?.id;
        
        // Fetch User's Stories History
        let history = [];
        try {
          const historyRes: any = await apiClient.get(ENDPOINTS.VIBE_STORIES.USER_HISTORY(userId));
          history = historyRes.stories || [];
        } catch (e) {
          console.log('Error fetching vibe history:', e);
        }
        setVibeHistory(history);

        const ownStoryGroup = (storiesRes.data?.data?.feed || []).find((group: any) => group.user.id === userId);
        setOwnVibeStories(ownStoryGroup ? ownStoryGroup.stories : []);
      } else if (matchParams.id) {
        try {
          const data = await ProfileService.getPublicProfile(matchParams.id);
          setMatchProfileData(data);
        } catch (err: any) {
          if (err?.status === 404 || err?.status === 403) {
            setIsBlockedByOther(true);
          }
          console.log('Error fetching match profile:', err);
        }
      }
    } catch (err) {
      console.log('Error fetching profile or stories:', err);
    } finally {
      setLoading(false);
    }
  }, [isOwnProfile, matchParams.id]);

  useEffect(() => {
    fetchProfile(); // initial fetch
    
    if (isOwnProfile) {
      const unsubscribe = navigation.addListener('focus', fetchProfile);
      return unsubscribe;
    }
  }, [isOwnProfile, navigation, fetchProfile]);

  // Real-time block listener
  useEffect(() => {
    const handleBlockEvent = (data: { targetUserId: string; isBlocked: boolean; blockedByMe: boolean }) => {
      if (isMatchProfile && data.targetUserId === matchParams.id) {
        if (data.isBlocked) {
          if (data.blockedByMe) {
            setMatchProfileData((prev: any) => ({ ...prev, blockedByMe: true }));
          } else {
            setIsBlockedByOther(true);
          }
        } else {
          // Unblocked
          fetchProfile();
        }
      }
    };

    chatSocketService.onUserBlocked(handleBlockEvent);
    
    const handleStatusUpdate = (payload: { userId: string; isOnline: boolean; lastActive: string }) => {
      const updatedUserId = payload.userId.toString().toLowerCase();
      const targetId = matchParams.id?.toString().toLowerCase();

      if (isMatchProfile && updatedUserId === targetId) {
        setMatchProfileData((prev: any) => prev ? { ...prev, isOnline: payload.isOnline, lastActive: payload.lastActive } : prev);
      }
    };
    
    chatSocketService.onUserStatusUpdate(handleStatusUpdate);

    return () => {
      chatSocketService.offUserBlocked(handleBlockEvent);
      chatSocketService.offUserStatusUpdate(handleStatusUpdate);
    };
  }, [isMatchProfile, matchParams.id, fetchProfile]);

  const profile = useMemo<UserProfile>(() => {
    if (isMatchProfile) {
      const apiData = matchProfileData;
      const matchDetail = getMatchProfileDetail(matchParams.id as string);
      const displayName = apiData?.displayName || (matchParams.name as string) || 'User';
      const fullName = apiData?.fullName || displayName;
      const blockedByMe = apiData?.blockedByMe || false;

      const baseProfile = {
        id: matchParams.id as string,
        fullName: fullName,
        displayName: apiData?.displayName ? `@${apiData.displayName}` : `@${displayName}`,
        avatar: apiData?.avatar || (matchParams.avatar as string),
        isVerified: false,
        blockedByMe,
        premiumPlan: profileMockData.premiumPlan,
        gender: apiData?.gender,
      };

      if (blockedByMe) {
        return {
          ...baseProfile,
          stats: [],
          currentVibe: undefined as any,
          pastVibes: [],
          bio: `Bạn đã chặn ${fullName}`,
        };
      }

      return {
        ...baseProfile,
        bio: apiData?.bio || matchDetail.bio,
        birthYear: apiData?.birthYear || 2000,
        location: apiData?.location || 'Gần bạn',
        stats: [
          { id: 'stats-distance', label: 'Distance', value: matchDetail.distanceKm },
          { id: 'stats-vibes', label: 'Vibes', value: apiData?.photos?.length || matchDetail.recentVibePhotos.length },
          { id: 'stats-likes', label: 'Likes', value: 0 },
          { id: 'stats-common', label: 'Common', value: matchDetail.interests.length },
        ],
        currentVibe: {
          id: `${matchDetail.id}-current-vibe`,
          text: apiData?.bio || matchDetail.bio,
          expiresIn: 'Con 12h',
          backgroundImage: apiData?.photos?.[0] || matchDetail.recentVibePhotos[0] || profileMockData.currentVibe?.backgroundImage || '',
        },
        isOnline: apiData?.isOnline || (matchParams.isOnline as boolean) || false,
        lastActive: apiData?.lastActive || null,
        premiumPlan: profileMockData.premiumPlan,
        pastVibes: (apiData?.vibes || apiData?.photos || matchDetail.recentVibePhotos || []).map((image: string, index: number) => ({
          id: `${matchDetail.id}-photo-${index}`,
          image,
          statusLabel: 'Hoạt động',
        })),
      };
    }

    // fallback mapping for own profile
    if (!ownProfileData) return profileMockData; // render mock while loading or on failure

    const vibes = ownProfileData.vibes || [];
    const photos = ownProfileData.photos || [];
    const fullName = ownProfileData.fullName || ownProfileData.displayName || 'Người dùng';
    const displayName = ownProfileData.displayName ? `@${ownProfileData.displayName}` : `@user${ownProfileData.id?.slice(-4)}`;
    const avatar = ownProfileData.avatar || profileMockData.avatar;
    const bio = ownProfileData.bio || 'Sẵn sàng kết nối';

    return {
      ...profileMockData,
      id: ownProfileData._id || ownProfileData.id || profileMockData.id,
      fullName: fullName,
      displayName: displayName,
      bio, 
      avatar,
      gender: ownProfileData.gender, // Remove default 'male'
      birthYear: ownProfileData.birthYear || profileMockData.birthYear,
      location: ownProfileData.location || profileMockData.location,
      pastVibes: vibeHistory.length > 0 ? vibeHistory.map((story: any) => ({
        id: story._id || story.id,
        image: story.imageUrl,
        statusLabel: new Date(story.expiresAt) > new Date() ? 'Hoạt động' : 'Đã kết thúc',
      })) : [...vibes, ...photos].map((image: string, index: number) => ({
        id: `own-vibe-${index}`,
        image,
        statusLabel: 'Kho lưu trữ',
      })),
      currentVibe: {
        id: 'current',
        text: bio,
        expiresIn: 'Mới cập nhật',
        backgroundImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600',
      },
      stats: [
        { id: 'stats-vibes', label: 'Vibes', value: vibes.length },
        ...(profileMockData.stats || []).slice(1)
      ]
    };
  }, [isMatchProfile, matchParams, ownProfileData, matchProfileData]);

  const hasStats = (profile.stats || []).length > 0;
  const hasPastVibes = (profile.pastVibes || []).length > 0;

  const statsTotal = useMemo(() => {
    return (profile.stats || []).reduce((sum, stat) => sum + stat.value, 0);
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
      conversationId: matchParams.conversationId || matchParams.id,
      name: matchParams.name,
      avatar: matchParams.avatar,
      isOnline: matchProfileData?.isOnline ?? Boolean(matchParams.isOnline),
      otherUserId: matchParams.id,
      lastActive: matchProfileData?.lastActive || null,
      blockedByMe: profile.blockedByMe,
    });
  }, [isOwnProfile, matchParams.avatar, matchParams.id, matchParams.isOnline, matchParams.name, navigation, profile.blockedByMe]);

  const handleUnblock = useCallback(async () => {
    if (!matchParams.id) return;
    try {
      await chatRepository.unblockUser(matchParams.id);
      setMatchProfileData((prev: any) => ({ ...prev, blockedByMe: false }));
      fetchProfile();
    } catch (err) {
      console.log('Unblock error:', err);
    }
  }, [matchParams.id, fetchProfile]);

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
    handleUnblock,
    isBlockedByOther,
    ownVibeStories,
    vibeHistory,
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
    handleVibeHistoryPress: (index: number) => {
      if (vibeHistory.length > 0) {
        navigation.navigate('VibeDetail', {
          userId: ownProfileData?._id || ownProfileData?.id,
          stories: vibeHistory,
          initialIndex: index,
          userName: 'Bạn',
          userAvatar: ownProfileData?.avatar,
        });
      }
    },
  };
};
