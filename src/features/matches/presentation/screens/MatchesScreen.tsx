import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { PremiumPrompt } from '../../../../components/atoms/PremiumPrompt';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useMatches } from '../../application/hooks/useMatches';
import { MatchVibeStoryCard } from '../components/MatchVibeStoryCard';
import { NewMatchItem } from '../components/NewMatchItem';

export const MatchesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    data,
    loading,
    hasNewMatches,
    hasVibeStories,
    topMatches,
    currentUserAvatar,
    ownVibeStories,
    handleMatchPress,
    handleStoryPress,
    handleOwnStoryPress,
    handleAddVibePress,
    handleLockedLikesPress,
  } = useMatches();

  const contentBottomPadding = insets.bottom + spacing.xxl + spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.neonCyan} />
        </View>
      ) : (
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
            {/* 1. Nút xem/thêm Vibe của Bản thân */}
            <TouchableOpacity 
              style={styles.addVibeCard} 
              onPress={ownVibeStories.length > 0 ? handleOwnStoryPress : handleAddVibePress} 
              activeOpacity={0.8}
            >
              <Image source={{ uri: currentUserAvatar || 'https://via.placeholder.com/150' }} style={styles.addVibeAvatar} />
              <View style={styles.addVibeOverlay} />
              
              {ownVibeStories.length > 0 ? (
                // Nếu đã có Story -> Hiện vòng tròn màu sắc hoặc hiệu ứng đang active
                <View style={styles.activeVibeRing} />
              ) : null}

              <View style={ownVibeStories.length > 0 ? styles.addIconSmallWrap : styles.addIconWrap}>
                <TouchableOpacity onPress={handleAddVibePress}>
                   <Icon name="add" size={ownVibeStories.length > 0 ? 16 : 24} color={colors.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.addVibeText}>Bản thân bạn</Text>
            </TouchableOpacity>

            {/* 2. Danh sách Vibe của những người đã Match */}
            {data.matchVibes.map((story) => (
              <MatchVibeStoryCard key={story.id} story={story} onPress={handleStoryPress} />
            ))}
          </ScrollView>
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
      )}
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
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addVibeCard: {
    width: 90,
    height: 120,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  addVibeAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addVibeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  addIconWrap: {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neonCyan,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.bgDark,
  },
  addIconSmallWrap: {
    position: 'absolute',
    bottom: 24,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neonCyan,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.bgDark,
  },
  activeVibeRing: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: colors.neonCyan,
    borderRadius: borderRadius.md,
  },
  addVibeText: {
    position: 'absolute',
    bottom: 8,
    left: 4,
    right: 4,
    textAlign: 'center',
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: '600',
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
