import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
  DeviceEventEmitter,
  InteractionManager,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useDiscovery } from '../../application/hooks/useDiscovery';
import type { Candidate } from '../../domain/types/vibe-card.types';
import { spacing } from '../../../../core/theme/spacing';
import { colors } from '../../../../core/theme/colors';
import { typography } from '../../../../core/theme';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export const DiscoveryScreen: React.FC = () => {
  const { candidates, handleLike, handleSkip, matchResult, isSwiping, dismissMatch, refreshCandidates, loading } = useDiscovery();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();

  const CURRENT_YEAR = new Date().getFullYear();

  // Navigate to MatchReveal with real match data
  React.useEffect(() => {
    if (!isFocused) return;

    if (matchResult?.isMatch && matchResult.match) {
      console.log('DiscoveryScreen: MATCH DETECTED! Navigating to MatchReveal', matchResult.match);
      const { conversationId, matchedUser } = matchResult.match;
      navigation.navigate('MatchReveal', {
        matchedUserName: matchedUser.fullName || matchedUser.displayName,
        matchedUserAvatar: matchedUser.avatar,
        conversationId,
      });
    }
  }, [matchResult, navigation, isFocused]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('match_reveal_consumed', () => {
      dismissMatch();
    });

    return () => {
      sub.remove();
    };
  }, [dismissMatch]);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      InteractionManager.runAfterInteractions(() => {
        if (!active) return;
        refreshCandidates();
      });

      return () => {
        active = false;
      };
    }, [refreshCandidates])
  );

  const handleCardPress = (index: number) => {
    navigation.navigate('DiscoveryDetail', { candidates, initialIndex: index });
  };

  const renderCardItem = (item: Candidate, index: number) => {
    const age = item.birthYear ? CURRENT_YEAR - item.birthYear : null;
    return (
      <TouchableOpacity
        key={item._id}
        style={[styles.cardContainer, { width: CARD_WIDTH }]}
        activeOpacity={0.9}
        onPress={() => handleCardPress(index)}
      >
        <ImageBackground
          source={item.avatar ? { uri: item.avatar } : undefined}
          style={styles.cardGradient}
          imageStyle={{ borderRadius: 24 }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            style={styles.bottomOverlay}
          >
            <View style={styles.infoRow}>
              <Text style={styles.nameText}>{item.fullName || item.displayName}</Text>
              {age ? <Text style={styles.ageText}>, {age}</Text> : null}
            </View>
            <Text style={styles.bioText} numberOfLines={2}>{item.bio || ''}</Text>

            <View style={styles.cardFooter}>
              <View style={styles.locationContainerCard}>
                <Icon name="location" size={13} color={colors.neonCyan} />
                <Text style={styles.locationTextCard} numberOfLines={1}>
                  Gần bạn
                </Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.skipButtonSmall]}
                  onPress={handleSkip}
                  disabled={isSwiping}
                >
                  <Icon name="close" size={20} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.likeButtonSmall]}
                  onPress={handleLike}
                  disabled={isSwiping}
                >
                  <Icon name="heart" size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>VIBECHECK<Text style={styles.headerSubtitle}></Text></Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')}>
            <Icon name="notifications-outline" size={20} color={colors.white} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="options-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card / Loading / Empty */}
      <View
        style={[
          styles.singleCardWrapper,
          { paddingBottom: spacing.xl + insets.bottom },
        ]}
      >
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.neonCyan} />
            <Text style={styles.loadingText}>Đang tìm vibe mới...</Text>
          </View>
        ) : candidates.length > 0 ? (
          renderCardItem(candidates[0], 0)
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.emptyEmoji}>✨</Text>
            <Text style={styles.emptyTitle}>Hết người rồi!</Text>
            <Text style={styles.emptySubtitle}>
              {'Bạn đã xem qua tất cả mọi người trong khu vực.\nQuay lại sau nhé 💫'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.overlayLight,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: 'bold',
    color: colors.neonCyan,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  singleCardWrapper: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  cardContainer: {
    height: height * 0.7,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end', // overlay content aligns to bottom
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  ageText: {
    fontSize: 20,
    color: colors.white,
    opacity: 0.9,
  },
  bioText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  locationContainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  locationTextCard: {
    fontSize: 12,
    color: colors.neonCyan,
  },
  cardHeader: {
    alignItems: 'center',
    marginTop: 10,
  },
  cardTag: {
    fontSize: 12,
    color: colors.textOpacity60,
    letterSpacing: 1,
    fontWeight: '600',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSubtitle: {
    fontSize: 26,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 34,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    fontSize: 12,
    color: colors.textOpacity80,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButtonSmall: {
    backgroundColor: colors.neonPink,
  },
  skipButtonSmall: {
    backgroundColor: colors.neonCyan,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    color: colors.textOpacity60,
    fontSize: typography.sizes.sm,
    marginTop: spacing.sm,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textOpacity60,
    textAlign: 'center',
    lineHeight: 22,
  },
});
