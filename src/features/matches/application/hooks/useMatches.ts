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
import { offSocketEvent, onSocketEvent } from '../../../../infrastructure/services/socket.service';
import { mapMatchData, mapStoryFeed } from './matches.mapper';

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

  const fetchData = useCallback(async () => {
    try {
      // Fetch Matches, Stories, and Own Profile in parallel
      const [matchesRes, storiesRes, profileRes]: any[] = await Promise.all([
        apiClient.get(ENDPOINTS.SWIPES.MATCHES),
        apiClient.get(ENDPOINTS.VIBE_STORIES.FEED),
        apiClient.get(ENDPOINTS.USER.GET_PROFILE),
      ]);

      const ownUser = profileRes?.user || profileRes?.data?.user || profileRes;
      const myId = (ownUser?._id || ownUser?.id)?.toString();

      const rawMatches = Array.isArray(matchesRes) ? matchesRes : matchesRes?.data || [];
      const mappedMatches = mapMatchData(rawMatches);

      // Keep only one item per user in the top strip to avoid duplicate keys and visual duplicates.
      const uniqueMatches = mappedMatches.filter((item, index, arr) => {
        return arr.findIndex((x) => x.id === item.id) === index;
      });

      // storiesRes is { feed: [...] } returned by the interceptor
      const storyFeed = storiesRes?.feed || storiesRes?.data?.feed || [];
      const { matchedStories, ownVibeStories } = mapStoryFeed(storyFeed, myId);

      setData((prev) => ({
        ...prev,
        newMatches: uniqueMatches,
        matchVibes: matchedStories,
        ownVibeStories,
      }));
    } catch (error) {
      console.error('Fetch Matches & Stories error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();

      const refreshFromSocket = () => fetchData();
      const handleStatusUpdate = (payload: any) => {
        setData((prev) => ({
          ...prev,
          newMatches: prev.newMatches.map((user) => {
            const updatedUserId = payload.userId.toString().toLowerCase();
            const targetId = user.id.toString().toLowerCase();

            if (updatedUserId === targetId) {
              return { ...user, isOnline: payload.isOnline };
            }
            return user;
          })
        }));
      };

      onSocketEvent('new_match', refreshFromSocket);
      onSocketEvent('status_update', handleStatusUpdate);

      // Refresh while staying on the screen so users always see the newest match/story data.
      const intervalId = setInterval(fetchData, 12000);

      return () => {
        offSocketEvent('new_match', refreshFromSocket);
        offSocketEvent('status_update', refreshFromSocket);
        clearInterval(intervalId);
      };
    }, [fetchData, ownProfileData?._id, ownProfileData?.id])
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
      if (user.conversationId) {
        navigation.navigate('ChatDetail', {
          conversationId: user.conversationId,
          name: user.name,
          avatar: user.avatar,
          isOnline: user.isOnline ?? false,
          otherUserId: user.id,
        });
      } else {
        navigation.navigate('MatchProfile', {
          id: user.id,
          name: user.name,
          age: user.age,
          avatar: user.avatar,
          isOnline: user.isOnline ?? false,
        });
      }
    },
    [navigation],
  );

  const handleStoryPress = useCallback(
    (story: MatchVibeStory) => {
      navigation.navigate('VibeDetail', {
        userId: story.ownerId,
        stories: (story as any).stories || [], 
        userName: story.ownerName,
        userAvatar: story.ownerAvatar,
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
