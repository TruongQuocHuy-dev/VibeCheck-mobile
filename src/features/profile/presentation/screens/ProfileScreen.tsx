import React from 'react';
import {
  ActivityIndicator,
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
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useProfile } from '../../application/hooks/useProfile';

const avatarSize = spacing.xxl + spacing.xxl + spacing.lg;

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {
    profile,
    loading,
    isOwnProfile,
    ownProfileData,
    handleSettingsPress,
    handleBack,
    handleEditAvatar,
    handleMessagePress,
    handleUnblock,
    isBlockedByOther,
    ownVibeStories,
    handleOwnStoryPress,
  } = useProfile();

  const contentBottomPadding = insets.bottom + spacing.xxl;

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
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            
            {!isOwnProfile && profile.isOnline && (
              <View style={styles.onlineBadge} />
            )}

            {ownVibeStories && ownVibeStories.length > 0 && (
              <View style={styles.activeVibeRing} />
            )}

            {isOwnProfile && (
              <TouchableOpacity
                style={styles.editAvatarButton}
                activeOpacity={0.9}
                onPress={handleEditAvatar}
              >
                <Icon name="create-outline" size={spacing.md_sm} color={colors.white} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <View style={styles.nameRow}>
            <Text style={styles.username}>{profile.username}</Text>
            {profile.isVerified && (
              <Icon name="checkmark-circle" size={spacing.lg} color={colors.primary} />
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

        {/* Basic Info Section */}
        {!profile.blockedByMe && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconWrap}>
                  <Icon name="calendar-outline" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Tuổi</Text>
                  <Text style={styles.infoValue}>
                    {profile.birthYear ? `${new Date().getFullYear() - profile.birthYear} tuổi` : 'Chưa cập nhật'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <View style={styles.infoIconWrap}>
                  <Icon name="location-outline" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Vị trí</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>
                    {profile.location || 'Bí mật'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <View style={styles.infoIconWrap}>
                  <Icon name="shield-checkmark-outline" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Trạng thái</Text>
                  <Text style={styles.infoValue}>
                    {profile.isVerified ? 'Đã xác thực' : 'Thành viên mới'}
                  </Text>
                </View>
              </View>
            </View>
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
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarWrap: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    marginBottom: spacing.sm,
    position: 'relative',
  },
  activeVibeRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    borderColor: colors.neonCyan,
    margin: -4,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bgDark,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.neonGreen,
    borderWidth: 2,
    borderColor: colors.bgDark,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  username: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  handle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bioContainer: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    width: '100%',
  },
  bioText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoSection: {
    marginTop: spacing.lg,
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
