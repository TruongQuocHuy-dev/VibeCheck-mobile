import React, { useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
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
const avatarSize = 100;

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const {
    profile,
    loading,
    isOwnProfile,
    ownProfileData,
    matchProfileData,
    handleSettingsPress,
    handleBack,
    handleMessagePress,
    handleUnblock,
    isBlockedByOther,
    ownVibeStories,
    handleOwnStoryPress,
    handleVibeHistoryPress,
    vibeHistory,
    hasMoreVibes,
    isFetchingMoreVibes,
    loadMoreVibes,
  } = useProfile();

  const storyColumns = 3;
  const storySize = (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * (storyColumns - 1)) / storyColumns;

  const genderLabel = 
    profile?.gender === 'male' ? 'Nam' : 
    profile?.gender === 'female' ? 'Nữ' : 
    profile?.gender === 'other' ? 'Khác' : 'N/A';
  const genderIcon =
    profile?.gender === 'male' ? 'male' :
      profile?.gender === 'female' ? 'female' : 'person-outline';

  const renderHeader = () => (
    <View style={styles.listHeader}>
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
              <Image source={{ uri: profile?.avatar || '' }} style={styles.avatarImage} />
            </View>
          </LinearGradient>

          {isOwnProfile && (
            <TouchableOpacity
              style={styles.cameraBadge}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('VibeCardEditor')}
            >
              <Icon name="camera" size={14} color={colors.white} />
            </TouchableOpacity>
          )}

          {!isOwnProfile && profile?.isOnline && (
            <View style={styles.activeIndicator} />
          )}
        </TouchableOpacity>

        <View style={styles.nameBlock}>
          <View style={styles.fullNameRow}>
            <Text style={styles.fullNameText}>{profile?.fullName}</Text>
            {profile?.isVerified && (
              <Icon name="checkmark-circle" size={18} color={colors.neonCyan} />
            )}
          </View>
          <Text style={styles.displayNameText}>{profile?.displayName}</Text>
        </View>

        {profile?.bio && (
          <View style={styles.bioBox}>
            <Text style={styles.bioContent}>{profile?.bio}</Text>
          </View>
        )}

        {/* Compact Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <Icon name={genderIcon} size={14} color={colors.neonCyan} />
            <Text style={styles.infoChipText}>{genderLabel}</Text>
          </View>
          <View style={styles.infoChip}>
            <Icon name="calendar-outline" size={14} color={colors.neonPink} />
            <Text style={styles.infoChipText}>{profile?.birthYear || 'N/A'}</Text>
          </View>
          <View style={styles.infoChip}>
            <Icon name="location-outline" size={14} color={colors.neonGreen} />
            <Text style={styles.infoChipText} numberOfLines={1}>{profile?.location || 'N/A'}</Text>
          </View>
        </View>

        {!isOwnProfile && (
          <TouchableOpacity style={styles.actionButton} onPress={handleMessagePress} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="chatbubble" size={18} color={colors.white} />
              <Text style={styles.actionButtonText}>Gửi lời nhắn</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {profile?.blockedByMe && (
        <View style={styles.blockedNotice}>
          <Icon name="lock-closed" size={20} color={colors.error} />
          <Text style={styles.blockedTitle}>Bạn đã chặn người dùng này</Text>
          <TouchableOpacity style={styles.unblockBtn} onPress={handleUnblock}>
            <Text style={styles.unblockBtnText}>Bỏ chặn</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Vibes Section Header */}
      <View style={styles.vibeHeader}>
        <Text style={styles.vibeTitle}>Vibes đã đăng</Text>
        <Text style={styles.vibeCount}>{vibeHistory.length} mục</Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingMoreVibes) return <View style={{ height: insets.bottom + spacing.xxl }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderVibeItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.storyCard, { width: storySize, height: storySize * 1.35 }]}
      activeOpacity={0.85}
      onPress={() => handleVibeHistoryPress(index)}
    >
      <Image source={{ uri: item.image }} style={styles.storyImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.storyOverlay}
      >
        <Text style={styles.storyStatus}>{item.statusLabel}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading && (!profile || (isOwnProfile && !ownProfileData) || (!isOwnProfile && !matchProfileData))) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isBlockedByOther) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
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
          {isOwnProfile ? 'Trang cá nhân' : profile?.fullName}
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

      <FlatList
        data={profile?.pastVibes}
        renderItem={renderVibeItem}
        keyExtractor={(item) => item.id}
        numColumns={storyColumns}
        columnWrapperStyle={styles.vibeRow}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => !loading && (
          <View style={styles.emptyStory}>
            <Icon name="image-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>Chưa có Vibe nào để hiển thị.</Text>
          </View>
        )}
        onEndReached={loadMoreVibes}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
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
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  flatListContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  listHeader: {
    paddingBottom: spacing.lg,
  },
  profileMain: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: colors.bgDark,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    borderWidth: 2,
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
    bottom: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.neonGreen,
    borderWidth: 2,
    borderColor: colors.bgDark,
  },
  nameBlock: {
    alignItems: 'center',
    gap: 2,
  },
  fullNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  fullNameText: {
    fontSize: 22,
    fontWeight: typography.weights.heavy,
    color: colors.textPrimary,
  },
  displayNameText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  bioBox: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  bioContent: {
    fontSize: typography.sizes.sm,
    color: colors.textOpacity80,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.bgTooltip,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  infoChipText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  actionButton: {
    marginTop: spacing.lg,
    width: '60%',
    height: 48,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.md,
  },
  vibeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.overlayBorder,
  },
  vibeTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  vibeCount: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  vibeRow: {
    justifyContent: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  storyCard: {
    borderRadius: borderRadius.md,
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
    padding: spacing.xs,
    height: '35%',
    justifyContent: 'flex-end',
  },
  storyStatus: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  emptyStory: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
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
    marginVertical: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(255, 69, 58, 0.05)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.1)',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  blockedTitle: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  unblockBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  unblockBtnText: {
    color: colors.white,
    fontWeight: typography.weights.bold,
    fontSize: 12,
  },
});
