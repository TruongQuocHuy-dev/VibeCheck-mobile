import React from 'react';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useCreateVibe } from '../../application/hooks/useCreateVibe';
import { MusicOptionCard } from '../components/MusicOptionCard';

export const CreateVibeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    previewPhoto,
    tracks,
    durations,
    location,
    caption,
    captionLength,
    maxCaptionLength,
    selectedTrackId,
    selectedDurationId,
    canSubmit,
    searchKeyword,
    handleClose,
    handleCaptionChange,
    handleTrackSelect,
    handleDurationSelect,
    handleSubmit,
    setSearchKeyword,
  } = useCreateVibe();

  const bottomActionPadding = insets.bottom + spacing.md;
  const scrollBottomPadding = spacing.xxl + spacing.xxl + bottomActionPadding;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.85} onPress={handleClose}>
          <Icon name="close" size={spacing.lg} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tạo Vibe</Text>

        <TouchableOpacity disabled={!canSubmit} onPress={handleSubmit}>
          <Text style={[styles.postText, canSubmit ? styles.postTextActive : styles.postTextDisabled]}>
            Đăng
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewCard}>
          <ImageBackground source={{ uri: previewPhoto }} style={styles.previewImage} imageStyle={styles.previewImageInner}>
            <View style={styles.previewOverlay}>
              <Icon name="eye-off-outline" size={spacing.xxl} color={colors.primary} />
              <Text style={styles.previewText}>Ảnh sẽ được làm mờ cho đến khi match</Text>
            </View>

            <TouchableOpacity style={styles.retakeButton} activeOpacity={0.85}>
              <Icon name="refresh" size={spacing.lg} color={colors.textPrimary} />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Caption của bạn</Text>
            <TouchableOpacity style={styles.emojiButton} activeOpacity={0.85}>
              <Icon name="happy-outline" size={spacing.lg} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.captionBox}>
            <TextInput
              style={styles.captionInput}
              multiline
              maxLength={maxCaptionLength}
              placeholder="Viết gì đó thú vị..."
              placeholderTextColor={colors.textMuted}
              value={caption}
              onChangeText={handleCaptionChange}
              textAlignVertical="top"
            />
            <Text style={styles.captionCounter}>
              {captionLength}/{maxCaptionLength}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thêm nhạc</Text>

          <View style={styles.searchWrap}>
            <Icon name="search" size={spacing.lg} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm bài hát, nghệ sĩ..."
              placeholderTextColor={colors.textMuted}
              value={searchKeyword}
              onChangeText={setSearchKeyword}
            />
          </View>

          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <MusicOptionCard
                track={item}
                isSelected={item.id === selectedTrackId}
                onPress={handleTrackSelect}
              />
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy bài hát.</Text>}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa điểm</Text>

          <View style={styles.locationCard}>
            <View>
              <Text style={styles.locationLabel}>{location.displayLabel}</Text>
              <Text style={styles.locationText}>{location.area}</Text>
            </View>

            <TouchableOpacity style={styles.locationChangeButton} activeOpacity={0.85}>
              <Text style={styles.locationChangeText}>Thay đổi</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>{location.helperText}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vibe tồn tại trong:</Text>

          <View style={styles.durationWrap}>
            {durations.map((duration) => {
              const isActive = duration.id === selectedDurationId;

              return (
                <TouchableOpacity
                  key={duration.id}
                  style={[styles.durationButton, isActive && styles.durationButtonActive]}
                  activeOpacity={0.9}
                  onPress={() => handleDurationSelect(duration.id)}
                >
                  <Text style={[styles.durationText, isActive && styles.durationTextActive]}>
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.privacyCard}>
          <View style={styles.privacyIconWrap}>
            <Icon name="lock-closed-outline" size={spacing.md_sm} color={colors.primary} />
          </View>
          <View style={styles.privacyTextWrap}>
            <Text style={styles.privacyTitle}>Chỉ người match với bạn mới thấy Vibe này</Text>
            <Text style={styles.privacySubtitle}>An toàn, riêng tư, không public</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footerContainer, { paddingBottom: bottomActionPadding }]}> 
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        >
          <TouchableOpacity style={styles.submitTouch} activeOpacity={0.9} onPress={handleSubmit}>
            <Text style={styles.submitText}>Đăng Vibe</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const previewSize = spacing.xxl + spacing.xxl + spacing.xxl + spacing.xl + spacing.md;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerButton: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  postText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  postTextActive: {
    color: colors.primary,
  },
  postTextDisabled: {
    color: colors.primaryDark,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  previewCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  previewImage: {
    width: '100%',
    minHeight: previewSize,
    justifyContent: 'center',
  },
  previewImageInner: {
    borderRadius: borderRadius.lg,
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blurDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  previewText: {
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.xxl,
  },
  retakeButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    width: spacing.xl + spacing.md,
    height: spacing.xl + spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  emojiButton: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionBox: {
    minHeight: spacing.xxl + spacing.xxl + spacing.xl,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardDark,
    padding: spacing.md,
  },
  captionInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.regular,
    padding: 0,
  },
  captionCounter: {
    color: colors.textMuted,
    alignSelf: 'flex-end',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  searchWrap: {
    minHeight: spacing.xxl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.cardDark,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    fontSize: typography.sizes.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
  locationCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    borderLeftColor: colors.primary,
    borderLeftWidth: 2,
    backgroundColor: colors.bgTooltip,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationLabel: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: spacing.xs / 2,
    marginBottom: spacing.xs,
  },
  locationText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  locationChangeButton: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    backgroundColor: colors.cyanBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  locationChangeText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontStyle: 'italic',
    paddingHorizontal: spacing.xs,
  },
  durationWrap: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  durationButton: {
    flex: 1,
    minHeight: spacing.xl + spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  durationText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  durationTextActive: {
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  privacyCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.cardDark,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  privacyIconWrap: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: borderRadius.md,
    backgroundColor: colors.pinkBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  privacyTextWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  privacyTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  privacySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.bgDark,
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitTouch: {
    minHeight: spacing.xxl + spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: colors.white,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
});
