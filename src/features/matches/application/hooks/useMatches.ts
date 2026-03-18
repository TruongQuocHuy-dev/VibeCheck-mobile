import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { matchesMockData } from '../../data/matches.data';
import {
  MatchVibeStory,
  MatchesScreenData,
  NewMatchUser,
} from '../../domain/types/matches.types';

type MatchesNavigation = NativeStackNavigationProp<RootStackParamList>;

export const useMatches = () => {
  const navigation = useNavigation<MatchesNavigation>();
  const [data] = useState<MatchesScreenData>(matchesMockData);

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
        photoUrl: story.backgroundImage,
        caption: `Vibe cua ${story.ownerName}`,
        durationLabel: story.expiresIn,
        location: story.hasLocation ? 'Ho Chi Minh City' : undefined,
        trackTitle: story.hasMusic ? 'Midnight Mood' : undefined,
        trackArtist: story.hasMusic ? story.ownerName : undefined,
        ownerName: story.ownerName,
        ownerAvatar: story.ownerAvatar,
        fromMatchStory: true,
      });
    },
    [navigation],
  );

  const handleLockedLikesPress = useCallback(() => {
    console.log('Open premium likes list');
  }, []);

  return {
    data,
    hasNewMatches,
    hasVibeStories,
    topMatches,
    handleFilterPress,
    handleMatchPress,
    handleStoryPress,
    handleLockedLikesPress,
  };
};
