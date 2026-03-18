import { useCallback, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { profileMockData } from '../../data/profile.data';
import { UserProfile } from '../../domain/types/profile.types';
import { getMatchProfileDetail } from '../../../matches/data/match-profile.data';

type ProfileNavigation = NativeStackNavigationProp<RootStackParamList>;

export const useProfile = () => {
  const navigation = useNavigation<ProfileNavigation>();
  const route = useRoute();

  const matchParams = (route.params || {}) as Partial<RootStackParamList['MatchProfile']>;
  const isMatchProfile = Boolean(matchParams.id && matchParams.name && matchParams.avatar);
  const isOwnProfile = !isMatchProfile;

  const profile = useMemo<UserProfile>(() => {
    if (!isMatchProfile) {
      return profileMockData;
    }

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
  }, [isMatchProfile, matchParams.avatar, matchParams.id, matchParams.name]);

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
      chatId: matchParams.id,
      name: matchParams.name,
      avatar: matchParams.avatar,
      isOnline: Boolean(matchParams.isOnline),
    });
  }, [isOwnProfile, matchParams.avatar, matchParams.id, matchParams.isOnline, matchParams.name, navigation]);

  return {
    profile,
    isOwnProfile,
    hasStats,
    hasPastVibes,
    statsTotal,
    handleSettingsPress,
    handleBack,
    handleEditAvatar,
    handleUpgradePress,
    handleMessagePress,
  };
};
