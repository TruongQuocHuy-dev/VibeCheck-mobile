import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { PremiumPrompt } from '../../../../components/atoms/PremiumPrompt';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { useMatches } from '../../application/hooks/useMatches';
import { MatchVibeStoryCard } from '../components/MatchVibeStoryCard';
import { NewMatchItem } from '../components/NewMatchItem';

export const MatchesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    data,
    hasNewMatches,
    hasVibeStories,
    topMatches,
    handleFilterPress,
    handleMatchPress,
    handleStoryPress,
    handleLockedLikesPress,
  } = useMatches();

  const contentBottomPadding = insets.bottom + spacing.xxl + spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.85} onPress={handleFilterPress}>
          <Icon name="options-outline" size={spacing.lg} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: contentBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MATCH MỚI</Text>

          {hasNewMatches ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {topMatches.map((user) => (
                <NewMatchItem key={user.id} user={user} onPress={handleMatchPress} />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>Chưa có match mới.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VIBE TỪ MATCH</Text>

          {hasVibeStories ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.matchVibes.map((story) => (
                <MatchVibeStoryCard key={story.id} story={story} onPress={handleStoryPress} />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>Chưa có vibe từ match.</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.likesCard}>
            <View style={styles.likesLeftRow}>
              <View style={styles.likesAvatarsWrap}>
                {data.lockedLikes.map((item, index) => (
                  <View
                    key={item.id}
                    style={[styles.lockedAvatarWrap, index > 0 && styles.lockedAvatarOverlap]}
                  >
                    <Image source={{ uri: item.avatar }} style={styles.lockedAvatar} blurRadius={4} />
                    <View style={styles.lockOverlay}>
                      <Icon name="lock-closed" size={spacing.md_sm} color={colors.white} />
                    </View>
                  </View>
                ))}

                <View style={[styles.lockedAvatarWrap, styles.totalLikesBubble]}>
                  <Text style={styles.totalLikesText}>{`+${data.totalLockedLikes} người`}</Text>
                </View>
              </View>
            </View>

            <View style={styles.likesRightCol}>
              <Text style={styles.likesTitle}>Đã thích bạn</Text>
              <PremiumPrompt
                buttonLabel="Xem ai"
                onPress={handleLockedLikesPress}
                showLockIcon={false}
                buttonVariant="solid"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md_sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
  },
  filterButton: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingTop: spacing.sm,
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semiBold,
    letterSpacing: spacing.xs + 1,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    paddingHorizontal: spacing.lg,
  },
  likesCard: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    backgroundColor: colors.cardDark,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likesLeftRow: {
    flex: 1,
    marginRight: spacing.sm,
  },
  likesAvatarsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedAvatarWrap: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.bgDark,
    overflow: 'hidden',
    backgroundColor: colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedAvatarOverlap: {
    marginLeft: -spacing.md,
  },
  lockedAvatar: {
    width: '100%',
    height: '100%',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blurDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLikesBubble: {
    marginLeft: -spacing.md,
    backgroundColor: colors.cardDark,
  },
  totalLikesText: {
    color: colors.accent,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
  likesRightCol: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  likesTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
