import { useCallback, useMemo, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import {
  MatchVibeStory,
  MatchesScreenData,
  NewMatchUser,
} from '../../domain/types/matches.types';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { useProfile } from '../../../../features/profile/application/hooks/useProfile';

type MatchesNavigation = NativeStackNavigationProp<RootStackParamList>;

export const useMatches = () => {
  const navigation = useNavigation<MatchesNavigation>();
  const { ownProfileData } = useProfile();

  const [data, setData] = useState<MatchesScreenData>({
    newMatches: [],
    matchVibes: [],
    lockedLikes: [],
    totalLockedLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // Fetch Matches, Stories, and Own Profile in parallel
          const [matchesRes, storiesRes, profileRes]: any[] = await Promise.all([
            apiClient.get(ENDPOINTS.SWIPES.MATCHES),
            apiClient.get(ENDPOINTS.VIBE_STORIES.FEED),
            apiClient.get(ENDPOINTS.USER.GET_PROFILE),
          ]);

          const ownUser = profileRes?.user || profileRes?.data?.user || profileRes;
          const myId = (ownUser?._id || ownUser?.id)?.toString();

          // MAP MATCHES
          // matchesRes is the array of matches returned by the interceptor
          const matches = (Array.isArray(matchesRes) ? matchesRes : matchesRes?.data || []).map((m: any) => ({
            id: m.user._id,
            name: m.user.fullName || m.user.displayName || 'Vibe User',
            age: m.user.birthYear ? new Date().getFullYear() - m.user.birthYear : 20,
            avatar: m.user.avatar || 'https://via.placeholder.com/150',
            isNew: !m.lastMessage,
            isOnline: m.user.isOnline || false,
          }));

          // MAP STORIES
          // storiesRes is { feed: [...] } returned by the interceptor
          const storyFeed = storiesRes?.feed || storiesRes?.data?.feed || [];

          const matchedStories: MatchVibeStory[] = storyFeed.map((group: any) => {
            const latestStory = group.stories[group.stories.length - 1];
            return {
              id: latestStory.id || latestStory._id,
              ownerId: group.user.id,
              ownerName: group.user.name,
              ownerAvatar: group.user.avatar || 'https://via.placeholder.com/150',
              backgroundImage: latestStory.imageUrl,
              expiresIn: '24h',
              hasLocation: false,
              hasMusic: !!latestStory.music,
              stories: group.stories,
            };
          }).filter((s: any) => {
            const ownerId = s.ownerId?.toString();
            return ownerId !== myId;
          });

          const ownStoryGroup = storyFeed.find((group: any) => group.user.id === myId);
          const ownVibeStories = ownStoryGroup ? ownStoryGroup.stories : [];

          setData((prev) => ({
            ...prev,
            newMatches: matches,
            matchVibes: matchedStories,
            ownVibeStories: ownVibeStories
          }));
        } catch (error) {
          console.error('Fetch Matches & Stories error:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [ownProfileData?._id, ownProfileData?.id])
  );

  const hasNewMatches = data.newMatches.length > 0;
  const hasVibeStories = data.matchVibes.length > 0;

  const topMatches = useMemo(() => {
    return data.newMatches.slice(0, 6);
  }, [data.newMatches]);

  const handleFilterPress = useCallback(() => {
    console.log('Open matches filter');
  }, []);

  const handleMatchPress = useCallback(
    (user: NewMatchUser) => {
      navigation.navigate('MatchProfile', {
        id: user.id,
        name: user.name,
        age: user.age,
        avatar: user.avatar,
        isOnline: user.isOnline,
      });
    },
    [navigation],
  );

  const handleStoryPress = useCallback(
    (story: MatchVibeStory) => {
      navigation.navigate('VibeDetail', {
        userId: story.ownerId,
        stories: (story as any).stories || [], 
      });
    },
    [navigation],
  );

  const handleAddVibePress = useCallback(() => {
    navigation.navigate('CreateVibe');
  }, [navigation]);

  const handleLockedLikesPress = useCallback(() => {
    console.log('Open premium likes list');
  }, []);

  const handleFeedPress = useCallback(() => {
    navigation.navigate('Feed' as never);
  }, [navigation]);

  return {
    data,
    loading,
    hasNewMatches,
    hasVibeStories,
    topMatches,
    currentUserAvatar: ownProfileData?.avatar || 'https://via.placeholder.com/150',
    handleFilterPress,
    handleMatchPress,
    handleStoryPress,
    handleOwnStoryPress: () => {
      if (data.ownVibeStories && data.ownVibeStories.length > 0) {
        navigation.navigate('VibeDetail', {
          userId: 'me',
          stories: data.ownVibeStories,
        });
      }
    },
    handleAddVibePress,
    handleLockedLikesPress,
    handleFeedPress,
    ownVibeStories: data.ownVibeStories || [],
  };
};
