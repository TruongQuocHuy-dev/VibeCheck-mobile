import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { UserProfile } from '../../domain/types/profile.types';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { ProfileService } from '../../../../infrastructure/services/profile.service';
import { chatSocketService } from '../../../chat/data/ChatSocketService';
import { chatRepository } from '../../../chat/data/ChatRepository';
import { LocationService } from '../../../../infrastructure/services/LocationService';

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

  // Pagination for Vibes
  const [vibePage, setVibePage] = useState(1);
  const [hasMoreVibes, setHasMoreVibes] = useState(true);
  const [isFetchingMoreVibes, setIsFetchingMoreVibes] = useState(false);

  const matchParams = (route.params || {}) as Partial<RootStackParamList['MatchProfile']>;
  const isMatchProfile = Boolean(matchParams.id && matchParams.name && matchParams.avatar);
  const isOwnProfile = !isMatchProfile;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setIsBlockedByOther(false);
    setVibePage(1);
    setHasMoreVibes(true);
    try {
      if (isOwnProfile) {
        const [userRes, storiesRes]: any = await Promise.all([
          apiClient.get(ENDPOINTS.USER.GET_PROFILE),
          apiClient.get(ENDPOINTS.VIBE_STORIES.FEED),
        ]);
        setOwnProfileData(userRes?.user || userRes);
        
        const userId = userRes?.user?._id || userRes?.id;
        
        // Fetch User's Stories History (Page 1)
        try {
          const historyRes: any = await apiClient.get(ENDPOINTS.VIBE_STORIES.USER_HISTORY(userId), {
            params: { page: 1, limit: 12 }
          });
          setVibeHistory(historyRes.data?.stories || historyRes.stories || []);
          setHasMoreVibes(historyRes.data?.pagination?.hasMore || false);
        } catch (e) {
          console.log('Error fetching vibe history:', e);
        }

        const ownStoryGroup = (storiesRes.feed || []).find((group: any) => group.user.id === userId);
        setOwnVibeStories(ownStoryGroup ? ownStoryGroup.stories : []);
      } else if (matchParams.id) {
        try {
          const [publicProfile, historyRes]: any = await Promise.all([
            ProfileService.getPublicProfile(matchParams.id),
            apiClient.get(ENDPOINTS.VIBE_STORIES.USER_HISTORY(matchParams.id), {
              params: { page: 1, limit: 12 }
            })
          ]);
          
          setMatchProfileData(publicProfile);
          
          const stories = historyRes.data?.stories || historyRes.stories || [];
          setVibeHistory(stories);
          setHasMoreVibes(historyRes.data?.pagination?.hasMore || false);

          // Populate active stories for the avatar ring if they exist (only for matched users)
          const activeStories = stories.filter((s: any) => new Date(s.expiresAt) > new Date());
          setOwnVibeStories(activeStories);

        } catch (err: any) {
          if (err?.status === 404 || err?.status === 403) {
            setIsBlockedByOther(true);
          }
          console.log('Error fetching match profile or vibe history:', err);
        }
      }
    } catch (err) {
      console.log('Error fetching profile or stories:', err);
    } finally {
      setLoading(false);
    }
  }, [isOwnProfile, matchParams.id]);

  const loadMoreVibes = useCallback(async () => {
    const userId = isOwnProfile ? (ownProfileData?._id || ownProfileData?.id) : matchParams.id;
    if (!userId || !hasMoreVibes || isFetchingMoreVibes) return;

    setIsFetchingMoreVibes(true);
    try {
      const nextPage = vibePage + 1;
      const historyRes: any = await apiClient.get(ENDPOINTS.VIBE_STORIES.USER_HISTORY(userId), {
        params: { page: nextPage, limit: 12 }
      });
      
      const newVibes = historyRes.data?.stories || historyRes.stories || [];
      if (newVibes.length > 0) {
        setVibeHistory(prev => [...prev, ...newVibes]);
        setVibePage(nextPage);
      }
      setHasMoreVibes(historyRes.data?.pagination?.hasMore || false);
    } catch (e) {
      console.log('Error loading more vibes:', e);
    } finally {
      setIsFetchingMoreVibes(false);
    }
  }, [isOwnProfile, ownProfileData, matchParams.id, hasMoreVibes, isFetchingMoreVibes, vibePage]);

  useEffect(() => {
    fetchProfile(); // initial fetch
    
    if (isOwnProfile) {
      // Smart location sync
      LocationService.syncLocation();
      
      const unsubscribe = navigation.addListener('focus', () => {
        fetchProfile();
        LocationService.syncLocation();
      });
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
    const formatLocation = (loc: any) => {
      if (!loc) return 'N/A';
      if (typeof loc === 'string') return loc;
      if (loc.type === 'Point' && Array.isArray(loc.coordinates)) {
        const [lng, lat] = loc.coordinates;
        if (lng === 0 && lat === 0) return 'N/A';
        return `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
      }
      return 'N/A';
    };

    if (isMatchProfile) {
      const apiData = matchProfileData;
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
        premiumPlan: {
          id: 'premium-v1',
          title: 'VibeCheck Premium',
          perks: ['Xem ai đã like bạn', 'Duyệt ẩn danh', '5 Boost miễn phí/tháng'],
          ctaLabel: 'Nâng cấp ngay',
        },
        gender: apiData?.gender,
        birthYear: apiData?.birthYear,
        location: formatLocation(apiData?.location),
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
        bio: apiData?.bio || 'Sẵn sàng kết nối',
        stats: [
          { id: 'stats-vibes', label: 'Vibes', value: vibeHistory.length },
          { id: 'stats-likes', label: 'Likes', value: 0 },
        ],
        currentVibe: {
          id: `${matchParams.id}-current-vibe`,
          text: apiData?.bio || '',
          expiresIn: 'Còn 12h',
          backgroundImage: '',
        },
        isOnline: apiData?.isOnline || (matchParams.isOnline as boolean) || false,
        lastActive: apiData?.lastActive || null,
        pastVibes: vibeHistory.map((story: any) => ({
          id: story._id || story.id,
          image: story.imageUrl,
          statusLabel: new Date(story.expiresAt) > new Date() ? 'Hoạt động' : 'Đã kết thúc',
        })),
      };
    }

    // fallback mapping for own profile
    if (!ownProfileData) return null as any;

    const vibes = ownProfileData.vibes || [];
    const fullName = ownProfileData.fullName || ownProfileData.displayName || 'Người dùng';
    const displayName = ownProfileData.displayName ? `@${ownProfileData.displayName}` : `@user${ownProfileData.id?.slice(-4)}`;
    const avatar = ownProfileData.avatar || '';
    const bio = ownProfileData.bio || 'Sẵn sàng kết nối';

    return {
      id: ownProfileData._id || ownProfileData.id,
      fullName: fullName,
      displayName: displayName,
      bio, 
      avatar,
      isVerified: true,
      gender: ownProfileData.gender,
      birthYear: ownProfileData.birthYear,
      location: formatLocation(ownProfileData.location),
      pastVibes: vibeHistory.map((story: any) => ({
        id: story._id || story.id,
        image: story.imageUrl,
        statusLabel: new Date(story.expiresAt) > new Date() ? 'Hoạt động' : 'Đã kết thúc',
      })),
      currentVibe: {
        id: 'current',
        text: bio,
        expiresIn: 'Mới cập nhật',
        backgroundImage: '',
      },
      premiumPlan: {
        id: 'premium-v1',
        title: 'VibeCheck Premium',
        perks: ['Xem ai đã like bạn', 'Duyệt ẩn danh', '5 Boost miễn phí/tháng'],
        ctaLabel: 'Nâng cấp ngay',
      },
      stats: [
        { id: 'stats-vibes', label: 'Vibes', value: vibes.length },
        { id: 'stats-matches', label: 'Matches', value: 0 },
        { id: 'stats-likes', label: 'Likes', value: 0 },
      ]
    };
  }, [isMatchProfile, matchParams, ownProfileData, matchProfileData, vibeHistory]);

  const hasStats = (profile?.stats || []).length > 0;
  const hasPastVibes = (profile?.pastVibes || []).length > 0;

  const statsTotal = useMemo(() => {
    return (profile?.stats || []).reduce((sum: number, stat: any) => sum + stat.value, 0);
  }, [profile?.stats]);

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
      blockedByMe: profile?.blockedByMe,
    });
  }, [isOwnProfile, matchParams.avatar, matchParams.id, matchParams.isOnline, matchParams.name, navigation, profile?.blockedByMe, matchProfileData]);

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
    matchProfileData,
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
    hasMoreVibes,
    isFetchingMoreVibes,
    loadMoreVibes,
    handleOwnStoryPress: () => {
      if (ownVibeStories.length > 0) {
        const uId = isOwnProfile ? (ownProfileData?._id || ownProfileData?.id) : matchParams.id;
        const uName = isOwnProfile ? 'Bạn' : (matchProfileData?.fullName || matchParams.name);
        const uAvatar = isOwnProfile ? ownProfileData?.avatar : (matchProfileData?.avatar || matchParams.avatar);

        navigation.navigate('VibeDetail', {
          userId: uId,
          stories: ownVibeStories,
          userName: uName,
          userAvatar: uAvatar,
          isMe: isOwnProfile,
        });
      }
    },
    handleVibeHistoryPress: (index: number) => {
      if (vibeHistory.length > 0) {
        const uId = isOwnProfile ? (ownProfileData?._id || ownProfileData?.id) : matchParams.id;
        const uName = isOwnProfile ? 'Bạn' : (matchProfileData?.fullName || matchParams.name);
        const uAvatar = isOwnProfile ? ownProfileData?.avatar : (matchProfileData?.avatar || matchParams.avatar);

        navigation.navigate('VibeDetail', {
          userId: uId,
          stories: vibeHistory,
          initialIndex: index,
          userName: uName,
          userAvatar: uAvatar,
          isMe: isOwnProfile,
        });
      }
    },
  };
};
