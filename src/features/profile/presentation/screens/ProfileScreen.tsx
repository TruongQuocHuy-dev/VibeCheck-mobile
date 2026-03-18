import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { PremiumPrompt } from '../../../../components/atoms/PremiumPrompt';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useProfile } from '../../application/hooks/useProfile';
import { PastVibeCard } from '../components/PastVibeCard';
import { ProfileStatItem } from '../components/ProfileStatItem';

const avatarSize = spacing.xxl + spacing.xxl + spacing.lg;

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    profile,
    isOwnProfile,
    hasStats,
    hasPastVibes,
    handleSettingsPress,
    handleBack,
    handleEditAvatar,
    handleUpgradePress,
    handleMessagePress,
  } = useProfile();

  const contentBottomPadding = insets.bottom + spacing.xxl + spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: contentBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerSide}>
            {!isOwnProfile && (
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={handleBack}>
                <Icon name="arrow-back" size={spacing.lg} color={colors.textPrimary} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.headerTitle}>{isOwnProfile ? 'Profile' : 'Match Profile'}</Text>

          <View style={[styles.headerSide, styles.headerSideRight]}>
            {isOwnProfile ? (
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={handleSettingsPress}>
                <Icon name="settings-outline" size={spacing.lg} color={colors.textPrimary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.messageButton} activeOpacity={0.9} onPress={handleMessagePress}>
                <Icon name="chatbubble-ellipses" size={spacing.md} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            {isOwnProfile && (
              <TouchableOpacity
                style={styles.editAvatarButton}
                activeOpacity={0.9}
                onPress={handleEditAvatar}
              >
                <Icon name="create-outline" size={spacing.md_sm} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.username}>{profile.username}</Text>
            {profile.isVerified && (
              <Icon name="checkmark-circle" size={spacing.lg} color={colors.primary} />
            )}
          </View>
          <Text style={styles.handle}>{profile.handle}</Text>
        </View>

        <View style={styles.statsSection}>
          {hasStats ? (
            profile.stats.map((stat) => (
              <ProfileStatItem key={stat.id} stat={stat} style={styles.statItem} />
            ))
          ) : (
            <Text style={styles.emptyText}>Chua co thong ke de hien thi.</Text>
          )}
        </View>

        <View style={styles.section}>
          {profile.currentVibe ? (
            <ImageBackground
              source={{ uri: profile.currentVibe.backgroundImage }}
              style={styles.currentVibeCard}
              imageStyle={styles.currentVibeImage}
              blurRadius={2}
            >
              <View style={styles.currentVibeOverlay}>
                <View style={styles.currentVibePill}>
                  <Text style={styles.currentVibePillText}>{profile.currentVibe.expiresIn}</Text>
                </View>
                <Text style={styles.currentVibeText}>{profile.currentVibe.text}</Text>
              </View>
            </ImageBackground>
          ) : (
            <View style={styles.emptyBlock}>
              <Text style={styles.emptyText}>Ban chua dang vibe nao.</Text>
            </View>
          )}
        </View>

        {isOwnProfile && (
          <View style={styles.section}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.premiumBorderGradient}
            >
              <View style={styles.premiumContent}>
                <View style={styles.premiumTitleRow}>
                  <View style={styles.premiumIconWrap}>
                    <Icon name="diamond" size={spacing.md} color={colors.primary} />
                  </View>
                  <Text style={styles.premiumTitle}>{profile.premiumPlan.title}</Text>
                </View>

                <View style={styles.premiumPerksContainer}>
                  {profile.premiumPlan.perks.map((perk) => (
                    <View key={perk} style={styles.premiumPerkRow}>
                      <Icon name="checkmark" size={spacing.md_sm} color={colors.primary} />
                      <Text style={styles.premiumPerkText}>{perk}</Text>
                    </View>
                  ))}
                </View>

                <PremiumPrompt
                  buttonLabel={profile.premiumPlan.ctaLabel}
                  onPress={handleUpgradePress}
                  showLockIcon={false}
                  buttonVariant="gradient"
                />
              </View>
            </LinearGradient>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isOwnProfile ? 'Vibe Da Dang' : 'Vibe gan day'}</Text>
          {hasPastVibes ? (
            <View style={styles.pastVibesGrid}>
              {profile.pastVibes.map((item) => (
                <PastVibeCard key={item.id} item={item} style={styles.pastVibeItem} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyBlock}>
              <Text style={styles.emptyText}>Lich su vibe trong.</Text>
            </View>
          )}
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
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: {
    width: spacing.xxl + spacing.md,
    minHeight: spacing.xl + spacing.sm,
    justifyContent: 'center',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  iconButton: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  messageButton: {
    minHeight: spacing.xl + spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.bgTooltip,
    borderColor: colors.overlayBorder,
    gap: spacing.xs,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarWrap: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  editAvatarButton: {
    position: 'absolute',
    right: spacing.xs,
    bottom: spacing.xs,
    width: spacing.lg + spacing.sm,
    height: spacing.lg + spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bgDark,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  username: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  handle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  statsSection: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.bgTooltip,
    paddingVertical: spacing.sm,
  },
  statItem: {
    flex: 1,
  },
  section: {
    gap: spacing.sm,
  },
  currentVibeCard: {
    minHeight: spacing.xxl + spacing.xxl + spacing.xl,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  currentVibeImage: {
    borderRadius: borderRadius.lg,
    opacity: 0.8,
  },
  currentVibeOverlay: {
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.blurDark,
  },
  currentVibePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.bgTooltip,
  },
  currentVibePillText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
  },
  currentVibeText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.xl + spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  premiumBorderGradient: {
    borderRadius: borderRadius.lg,
    padding: 1,
  },
  premiumContent: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardDark,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  premiumTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  premiumIconWrap: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cyanBg,
  },
  premiumTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  premiumPerksContainer: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  premiumPerkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumPerkText: {
    marginLeft: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  pastVibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  pastVibeItem: {
    width: '47%',
  },
  emptyBlock: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.bgTooltip,
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
