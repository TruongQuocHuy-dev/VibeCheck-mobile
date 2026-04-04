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
    handleSettingsPress,
    handleBack,
    handleEditAvatar,
    handleMessagePress,
    handleUnblock,
    isBlockedByOther,
    ownVibeStories,
    handleOwnStoryPress,
    handleVibeHistoryPress,
    vibeHistory,
  } = useProfile();

  const contentBottomPadding = insets.bottom + 120; // Increased to ensure visibility above Tab Bar

  const storyColumns = 3;
  const storySize = (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * (storyColumns - 1)) / storyColumns;

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

  const genderLabel = 
    profile.gender === 'male' ? 'Nam' : 
    profile.gender === 'female' ? 'Nữ' : 
    profile.gender === 'other' ? 'Khác' : 'Chưa cập nhật';
  const genderIcon =
    profile.gender === 'male' ? 'male' :
      profile.gender === 'female' ? 'female' : 'person-outline';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      {/* Header Navigation */}
      <View style={styles.header}>
        {isOwnProfile ? (
          <View style={styles.headerSide} />
        ) : (
          <View style={styles.headerSide}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={handleBack}>
              <Icon name="chevron-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.headerTitle} numberOfLines={1}>
          {isOwnProfile ? 'Trang cá nhân' : profile.fullName}
        </Text>

        <View style={[styles.headerSide, styles.headerSideRight]}>
          {isOwnProfile ? (
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={handleSettingsPress}>
              <Icon name="settings-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: contentBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Main Section */}
        <View style={styles.profileMain}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => isOwnProfile ? navigation.navigate('VibeCardEditor') : (ownVibeStories.length > 0 ? handleOwnStoryPress() : undefined)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[colors.neonCyan, colors.primary, colors.neonPink]}
              style={styles.avatarRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.avatarInner}>
                <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
              </View>
            </LinearGradient>

            {isOwnProfile && (
              <TouchableOpacity
                style={styles.cameraBadge}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('VibeCardEditor')}
              >
                <Icon name="camera" size={16} color={colors.white} />
              </TouchableOpacity>
            )}

            {!isOwnProfile && profile.isOnline && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>

          <View style={styles.nameBlock}>
            <View style={styles.fullNameRow}>
              <Text style={styles.fullNameText}>{profile.fullName}</Text>
              {profile.isVerified && (
                <Icon name="checkmark-circle" size={20} color={colors.neonCyan} />
              )}
            </View>
            <Text style={styles.displayNameText}>{profile.displayName}</Text>
          </View>

          {profile.bio && (
            <View style={styles.bioBox}>
              <Text style={styles.bioContent}>{profile.bio}</Text>
            </View>
          )}
        </View>

        {/* Basic Information Grid */}
        <View style={styles.infoGrid}>
          <Text style={styles.sectionHeading}>Thông tin cơ bản</Text>
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={styles.gridItem}
              activeOpacity={isOwnProfile ? 0.7 : 1}
              onPress={() => isOwnProfile && navigation.navigate('VibeCardEditor')}
            >
              <View style={[styles.itemIconWrap, { backgroundColor: 'rgba(0, 240, 255, 0.1)' }]}>
                <Icon name={genderIcon} size={20} color={colors.neonCyan} />
              </View>
              <View style={styles.itemTextContent}>
                <Text style={styles.itemLabel}>Giới tính</Text>
                <Text
                  style={[
                    styles.itemValue,
                    !profile.gender && isOwnProfile && { color: colors.neonCyan }
                  ]}
                  numberOfLines={1}
                >
                  {genderLabel}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.gridItem}>
              <View style={[styles.itemIconWrap, { backgroundColor: 'rgba(255, 0, 191, 0.1)' }]}>
                <Icon name="calendar-outline" size={20} color={colors.neonPink} />
              </View>
              <View style={styles.itemTextContent}>
                <Text style={styles.itemLabel}>Năm sinh</Text>
                <Text style={styles.itemValue}>{profile.birthYear || 'Chưa cập nhật'}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.gridRow, { marginTop: spacing.md }]}>
            <View style={[styles.gridItem, { flex: 1 }]}>
              <View style={[styles.itemIconWrap, { backgroundColor: 'rgba(57, 255, 20, 0.1)' }]}>
                <Icon name="location-outline" size={20} color={colors.neonGreen} />
              </View>
              <View style={styles.itemTextContent}>
                <Text style={styles.itemLabel}>Vị trí</Text>
                <Text style={styles.itemValue} numberOfLines={1}>{profile.location || 'Chưa cập nhật'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Story History Section */}
        <View style={styles.storySection}>
          <View style={styles.storyHeader}>
            <Text style={styles.sectionHeading}>Lịch sử story</Text>
            <Text style={styles.storyCount}>{profile.pastVibes?.length || 0} mục</Text>
          </View>

          {hasPastVibes ? (
            <View style={styles.storyGrid}>
              {profile.pastVibes?.map((story, index) => (
                <TouchableOpacity
                  key={story.id}
                  style={[styles.storyCard, { width: storySize, height: storySize * 1.3 }]}
                  activeOpacity={0.85}
                  onPress={() => isOwnProfile && handleVibeHistoryPress(index)}
                >
                  <Image source={{ uri: story.image }} style={styles.storyImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.storyOverlay}
                  >
                    <Text style={styles.storyStatus}>{story.statusLabel}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStory}>
              <Icon name="image-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>Chưa có lịch sử story nào để hiển thị.</Text>
            </View>
          )}
        </View>

        {profile.blockedByMe && (
          <View style={styles.blockedNotice}>
            <Icon name="lock-closed" size={24} color={colors.error} />
            <Text style={styles.blockedTitle}>Bạn đã chặn người dùng này</Text>
            <TouchableOpacity style={styles.unblockBtn} onPress={handleUnblock}>
              <Text style={styles.unblockBtnText}>Bỏ chặn ngay</Text>
            </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  headerSide: {
    width: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  headerSpacer: {
    width: 60,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
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
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  profileMain: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatarRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.bgDark,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.neonGreen,
    borderWidth: 3,
    borderColor: colors.bgDark,
  },
  nameBlock: {
    alignItems: 'center',
    gap: 4,
  },
  fullNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  fullNameText: {
    fontSize: 24,
    fontWeight: typography.weights.heavy,
    color: colors.textPrimary,
  },
  displayNameText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  bioBox: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  bioContent: {
    fontSize: typography.sizes.md,
    color: colors.textOpacity80,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoGrid: {
    marginTop: spacing.md,
    backgroundColor: colors.bgTooltip,
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md_sm, // Reduced from xl to make it wider
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  sectionHeading: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl, // More breathing room
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    opacity: 0.9,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg, // Increased gap
  },
  gridItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    overflow: 'hidden',
  },
  itemTextContent: {
    flex: 1,
  },
  itemIconWrap: {
    width: 46, // Slightly larger icons for better presence
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.bold,
    marginBottom: 2,
  },
  itemValue: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.semiBold,
  },
  storySection: {
    marginTop: spacing.xxl,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  storyCount: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  storyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  storyCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    height: '40%',
    justifyContent: 'flex-end',
  },
  storyStatus: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  emptyStory: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
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
  blockedNotice: {
    marginTop: spacing.xxl,
    padding: spacing.xl,
    backgroundColor: 'rgba(255, 69, 58, 0.05)',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.1)',
    alignItems: 'center',
    gap: spacing.md,
  },
  blockedTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  unblockBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  unblockBtnText: {
    color: colors.white,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.md,
  },
});
