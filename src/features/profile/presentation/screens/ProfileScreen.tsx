import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
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
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useProfile } from '../../application/hooks/useProfile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const avatarSize = 110;
const statsCount = 4;
const statCardWidth = (SCREEN_WIDTH - spacing.lg * 2 - spacing.md * (statsCount - 1)) / statsCount;

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {
    profile,
    loading,
    isOwnProfile,
    ownProfileData,
    hasPastVibes,
    hasStats,
    statsTotal,
    handleSettingsPress,
    handleBack,
    handleEditAvatar,
    handleMessagePress,
    handleUnblock,
    isBlockedByOther,
    ownVibeStories,
    handleOwnStoryPress,
    handleVibeHistoryPress,
  } = useProfile();

  const contentBottomPadding = insets.bottom + spacing.xxl;

  const vibeColumns = 3;
  const vibeCardSize = (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * (vibeColumns - 1)) / vibeColumns;

  if (isOwnProfile && loading && !ownProfileData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isBlockedByOther) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={handleBack}>
            <Icon name="arrow-back" size={spacing.lg} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.unavailableContainer}>
          <Icon name="person-circle-outline" size={80} color={colors.textSecondary} />
          <Text style={styles.unavailableTitle}>Người dùng này không khả dụng</Text>
          <Text style={styles.unavailableSubtitle}>Liên kết bạn theo dõi có thể đã bị hỏng hoặc người dùng đã chặn bạn.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: contentBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSide}>
            {!isOwnProfile && (
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={handleBack}>
                <Icon name="arrow-back" size={spacing.lg} color={colors.textPrimary} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.headerTitle}>{isOwnProfile ? 'Trang cá nhân' : ''}</Text>

          <View style={[styles.headerSide, styles.headerSideRight]}>
            {isOwnProfile ? (
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={handleSettingsPress}>
                <Icon name="settings-outline" size={spacing.lg} color={colors.textPrimary} />
              </TouchableOpacity>
            ) : (
              !profile.blockedByMe && (
                <TouchableOpacity style={styles.messageButton} activeOpacity={0.9} onPress={handleMessagePress}>
                  <Icon name="chatbubble-ellipses" size={spacing.md} color={colors.white} />
                  <Text style={styles.messageButtonText}>Nhắn tin</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={ownVibeStories && ownVibeStories.length > 0 ? handleOwnStoryPress : undefined}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.neonCyan, colors.primary, colors.neonPink]}
              style={styles.avatarGradientRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            
            {!isOwnProfile && profile.isOnline && (
              <View style={styles.onlineBadge} />
            )}

            {isOwnProfile && (
              <TouchableOpacity
                style={styles.editAvatarButton}
                activeOpacity={0.9}
                onPress={handleEditAvatar}
              >
                <Icon name="camera" size={spacing.md_sm} color={colors.white} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <View style={styles.nameRow}>
            <Text style={styles.username}>{profile.username}</Text>
            {profile.isVerified && (
              <Icon name="checkmark-circle" size={spacing.lg} color={colors.neonCyan} />
            )}
          </View>
          <Text style={styles.handle}>{profile.handle}</Text>

          {profile.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          )}

          {profile.blockedByMe && (
            <View style={styles.blockedBanner}>
              <Icon name="lock-closed" size={24} color={colors.error} />
              <Text style={styles.blockedBannerText}>Bạn đã chặn người dùng này</Text>
              <Text style={styles.blockedBannerSubtext}>VibeCheck sẽ ẩn các hoạt động và hình ảnh của họ để bảo vệ sự riêng tư của bạn.</Text>

              <TouchableOpacity style={styles.unblockActionBtn} onPress={handleUnblock}>
                <Text style={styles.unblockActionBtnText}>Bỏ chặn</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats Section */}
        {!profile.blockedByMe && hasStats && (
          <View style={styles.statsSection}>
            <View style={styles.statsCard}>
              {profile.stats?.map((stat, index) => (
                <View key={stat.id} style={[styles.statItem, index > 0 && styles.statDivider]}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Basic Info Section */}
        {!profile.blockedByMe && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconWrap}>
                  <Icon name="calendar-outline" size={20} color={colors.neonCyan} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Tuổi</Text>
                  <Text style={styles.infoValue}>
                    {profile.birthYear ? `${new Date().getFullYear() - profile.birthYear} tuổi` : 'Chưa cập nhật'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <View style={styles.infoIconWrap}>
                  <Icon name="location-outline" size={20} color={colors.neonPink} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Vị trí</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {profile.location || 'Bí mật'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <View style={styles.infoIconWrap}>
                  <Icon name="shield-checkmark-outline" size={20} color={colors.success} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Trạng thái</Text>
                  <Text style={styles.infoValue}>
                    {profile.isVerified ? 'Đã xác thực' : 'Thành viên mới'}
                  </Text>
                </View>
              </View>

              {!isOwnProfile && profile.isOnline && (
                <>
                  <View style={styles.infoDivider} />
                  <View style={styles.infoItem}>
                    <View style={styles.infoIconWrap}>
                      <Icon name="radio-button-on" size={20} color={colors.neonGreen} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Hoạt động</Text>
                      <Text style={[styles.infoValue, { color: colors.neonGreen }]}>Đang trực tuyến</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {/* Vibe History Section */}
        {!profile.blockedByMe && (
          <View style={styles.vibeSection}>
            <View style={styles.vibeSectionHeader}>
              <Text style={styles.sectionTitle}>Vibe đã đăng</Text>
              {hasPastVibes && (
                <Text style={styles.vibeCount}>{profile.pastVibes?.length || 0} ảnh</Text>
              )}
            </View>
            
            {hasPastVibes ? (
              <View style={styles.vibeGrid}>
                {profile.pastVibes?.map((vibe, index) => (
                  <TouchableOpacity
                    key={vibe.id}
                    style={[styles.vibeCard, { width: vibeCardSize, height: vibeCardSize }]}
                    activeOpacity={0.85}
                    onPress={() => isOwnProfile && handleVibeHistoryPress(index)}
                  >
                    <Image source={{ uri: vibe.image }} style={styles.vibeImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      style={styles.vibeOverlay}
                    >
                      <View style={styles.vibeStatusContainer}>
                        <View style={[
                          styles.vibeStatusDot,
                          vibe.statusLabel === 'Hoạt động' && styles.vibeStatusDotActive
                        ]} />
                        <Text style={[
                          styles.vibeStatus,
                          vibe.statusLabel === 'Hoạt động' && styles.vibeStatusActive
                        ]}>
                          {vibe.statusLabel}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyVibeContainer}>
                <View style={styles.emptyVibeIconWrap}>
                  <Icon name="camera-outline" size={40} color={colors.textMuted} />
                </View>
                <Text style={styles.emptyVibeText}>
                  {isOwnProfile ? 'Bạn chưa đăng vibe nào' : `${profile.username} chưa chia sẻ vibe`}
                </Text>
                {isOwnProfile && (
                  <TouchableOpacity style={styles.createVibeButton} activeOpacity={0.9}>
                    <Text style={styles.createVibeButtonText}>Tạo vibe đầu tiên</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingVertical: spacing.sm,
  },
  headerSide: {
    width: spacing.xxl + spacing.md,
    justifyContent: 'center',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  messageButton: {
    height: 44,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  messageButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarWrap: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  avatarGradientRing: {
    position: 'absolute',
    width: avatarSize + 8,
    height: avatarSize + 8,
    borderRadius: borderRadius.full,
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    borderColor: colors.bgDark,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.bgDark,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.neonGreen,
    borderWidth: 3,
    borderColor: colors.bgDark,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  username: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.heavy,
    color: colors.textPrimary,
  },
  handle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bioContainer: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    width: '100%',
  },
  bioText: {
    color: colors.textOpacity80,
    fontSize: typography.sizes.md,
    lineHeight: 22,
    textAlign: 'center',
  },
  statsSection: {
    marginTop: spacing.sm,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgTooltip,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    paddingVertical: spacing.md,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.overlayBorder,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoSection: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.bgTooltip,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoIconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.whiteOpacity10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.semiBold,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.overlayBorder,
    marginHorizontal: spacing.md,
  },
  vibeSection: {
    marginTop: spacing.sm,
  },
  vibeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  vibeCount: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  vibeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  vibeCard: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  vibeImage: {
    width: '100%',
    height: '100%',
  },
  vibeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xs,
    height: '45%',
    justifyContent: 'flex-end',
  },
  vibeStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    justifyContent: 'center',
  },
  vibeStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
  },
  vibeStatusDotActive: {
    backgroundColor: colors.neonCyan,
  },
  vibeStatus: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  vibeStatusActive: {
    color: colors.neonCyan,
    opacity: 1,
  },
  emptyVibeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.bgTooltip,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    gap: spacing.md,
  },
  emptyVibeIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.whiteOpacity10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyVibeText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  createVibeButton: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  createVibeButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
  },
  unavailableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  unavailableTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  unavailableSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  blockedBanner: {
    marginTop: spacing.xl,
    padding: spacing.xl,
    backgroundColor: 'rgba(255, 69, 58, 0.05)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.1)',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  blockedBannerText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  blockedBannerSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  unblockActionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  unblockActionBtnText: {
    color: colors.white,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.md,
  },
});
