import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useCreateVibe } from '../../application/hooks/useCreateVibe';
import { VibeCaptureButton } from '../components/VibeCaptureButton';
import { MusicOptionCard } from '../components/MusicOptionCard';

const { width } = Dimensions.get('window');

export const CreateVibeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [showMusicModal, setShowMusicModal] = React.useState(false);

  const {
    previewPhoto,
    currentMode,
    intensity,
    isFlashOn,
    activeFilterId,
    tracks,
    selectedTrackId,
    isSearchingMusic,
    searchKeyword,
    selectedTrack,
    canSubmit,
    isSubmitting,
    toggleFlash,
    changeMode,
    applyFilter,
    handleClose,
    handlePickImage,
    handleSubmit,
    handleTrackSelect,
    setSearchKeyword,
  } = useCreateVibe();

  const handleMusicConfirm = useCallback(() => {
    setShowMusicModal(false);
  }, []);

  const mockPreview = 'https://images.unsplash.com/photo-1514525253361-b83f20ca914a?q=80&w=1000&auto=format&fit=crop';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Ambient Background Glows */}
      <View style={[styles.ambientGlow, styles.ambientTopLeft]} />
      <View style={[styles.ambientGlow, styles.ambientBottomRight]} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Navigation */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <Icon
              name={isFlashOn ? 'flash' : 'flash-outline'}
              size={24}
              color={isFlashOn ? colors.vibeCyan : colors.white}
            />
          </TouchableOpacity>

          <Text style={styles.logoText}>VibeCheck</Text>

          <TouchableOpacity style={styles.iconButton} onPress={handleClose}>
            <Icon name="close" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Viewfinder Main Area */}
        <View style={styles.viewfinderContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePickImage}
            style={styles.viewfinderWrapper}
          >
            <ImageBackground
              source={{ uri: previewPhoto || mockPreview }}
              style={styles.viewfinder}
              imageStyle={[
                styles.viewfinderImage,
                !previewPhoto && styles.viewfinderImageBlur,
              ]}
            >
              <View style={styles.viewfinderOverlay}>
                {/* Right Side Buttons */}
                <View style={styles.sideControls}>
                  <TouchableOpacity
                    style={[styles.controlButton, activeFilterId === 'vintage' && styles.controlButtonActive]}
                    onPress={() => applyFilter('vintage')}
                  >
                    <Icon name="filter-variant" size={20} color={colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlButton, activeFilterId === 'exposure' && styles.controlButtonActive]}
                    onPress={() => applyFilter('exposure')}
                  >
                    <Icon name="brightness-6" size={20} color={colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlButton, activeFilterId === 'auto' && styles.controlButtonActive]}
                    onPress={() => applyFilter('auto')}
                  >
                    <Icon name="auto-fix" size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>

                {/* Left Side Intensity Meter */}
                <View style={styles.intensityContainer}>
                  <View style={styles.meterTrack}>
                    <LinearGradient
                      colors={[colors.vibeGradientEnd, colors.vibeGradientStart]}
                      style={[styles.meterFill, { height: `${intensity * 100}%` as any }]}
                    />
                  </View>
                  <Text style={styles.intensityText}>INTENSITY</Text>
                </View>

                {/* Brackets Decor */}
                <View style={[styles.bracket, styles.bracketTopLeft]} />
                <View style={[styles.bracket, styles.bracketTopRight]} />
                <View style={[styles.bracket, styles.bracketBottomLeft]} />
                <View style={[styles.bracket, styles.bracketBottomRight]} />

                {/* No photo hint */}
                {!previewPhoto && (
                  <View style={styles.tapHint}>
                    <Icon name="image-plus" size={36} color={colors.whiteOpacity80} />
                    <Text style={styles.tapHintText}>Chạm để chọn ảnh</Text>
                  </View>
                )}
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* Selected track chip inside viewfinder area */}
          {selectedTrack && (
            <View style={styles.selectedTrackChip}>
              <Icon name="music-note" size={14} color={colors.vibeCyan} />
              <Text style={styles.selectedTrackText} numberOfLines={1}>
                {selectedTrack.title} · {selectedTrack.artist}
              </Text>
              <TouchableOpacity onPress={() => setShowMusicModal(true)}>
                <Icon name="pencil-outline" size={14} color={colors.whiteOpacity80} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          {(['LIVE', 'VIBE', 'REEL'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => changeMode(mode)}
              style={styles.modeItem}
            >
              <Text style={[styles.modeText, currentMode === mode && styles.modeTextActive]}>
                {mode}
              </Text>
              {currentMode === mode && <View style={styles.modeActiveLine} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Actions */}
        <View style={styles.footer}>
          {/* Gallery */}
          <TouchableOpacity style={styles.footerIconButton} onPress={handlePickImage}>
            <Icon name="image-multiple-outline" size={24} color={colors.whiteOpacity80} />
          </TouchableOpacity>

          {/* Capture / Post */}
          {canSubmit ? (
            <TouchableOpacity
              style={styles.postButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.bgDark} />
              ) : (
                <>
                  <Icon name="send" size={22} color={colors.bgDark} />
                  <Text style={styles.postButtonText}>Đăng</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <VibeCaptureButton onPress={handlePickImage} />
          )}

          {/* Music */}
          <TouchableOpacity
            style={[styles.footerIconButton, selectedTrack && styles.footerIconButtonActive]}
            onPress={() => setShowMusicModal(true)}
          >
            <Icon name="music-note" size={24} color={selectedTrack ? colors.vibeCyan : colors.whiteOpacity80} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── Music Picker Modal ── */}
      <Modal
        visible={showMusicModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMusicModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <SafeAreaView style={styles.musicSheet} edges={['bottom']}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Thêm nhạc</Text>
              <TouchableOpacity onPress={handleMusicConfirm}>
                <Icon name="check" size={24} color={colors.vibeCyan} />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
              <Icon name="magnify" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm bài hát, nghệ sĩ..."
                placeholderTextColor={colors.textMuted}
                value={searchKeyword}
                onChangeText={setSearchKeyword}
              />
            </View>

            {/* Track List */}
            <FlatList
              data={tracks}
              keyExtractor={(item) => item.id}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.trackList}
              renderItem={({ item }) => (
                <MusicOptionCard
                  track={item}
                  isSelected={item.id === selectedTrackId}
                  onPress={handleTrackSelect}
                  variant="row"
                />
              )}
              ListEmptyComponent={
                isSearchingMusic ? (
                  <ActivityIndicator size="small" color={colors.vibeCyan} style={{ marginTop: spacing.lg }} />
                ) : (
                  <Text style={styles.emptyText}>
                    {searchKeyword.length > 0 ? 'Không tìm thấy bài hát.' : 'Tìm kiếm để thêm nhạc vào Vibe của bạn.'}
                  </Text>
                )
              }
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceLow,
  },
  safeArea: {
    flex: 1,
  },
  ambientGlow: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    opacity: 0.08,
  },
  ambientTopLeft: {
    top: -width * 0.2,
    left: -width * 0.2,
    backgroundColor: colors.vibeCyan,
  },
  ambientBottomRight: {
    bottom: -width * 0.2,
    right: -width * 0.2,
    backgroundColor: colors.vibePurple,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  logoText: {
    fontSize: 20,
    fontWeight: typography.weights.heavy,
    color: colors.vibeCyan,
    letterSpacing: -0.5,
  },
  viewfinderContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  viewfinderWrapper: {
    aspectRatio: 3 / 4,
    width: '100%',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.vibePurpleOpacity30,
    overflow: 'hidden',
  },
  viewfinder: {
    flex: 1,
  },
  viewfinderImage: {
    opacity: 0.85,
  },
  viewfinderImageBlur: {
    opacity: 0.45,
  },
  viewfinderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 18, 29, 0.25)',
    padding: spacing.lg,
  },
  tapHint: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  tapHintText: {
    color: colors.whiteOpacity80,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
  },
  sideControls: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    gap: spacing.md,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.whiteOpacity10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  controlButtonActive: {
    backgroundColor: colors.vibePurpleOpacity40,
    borderColor: colors.vibePurple,
  },
  intensityContainer: {
    position: 'absolute',
    left: spacing.md,
    top: '30%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  meterTrack: {
    width: 2,
    height: 120,
    backgroundColor: colors.overlayBorder,
    borderRadius: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  meterFill: {
    width: '100%',
    borderRadius: 1,
  },
  intensityText: {
    fontSize: typography.sizes.xs,
    color: colors.textOpacity60,
    fontWeight: typography.weights.bold,
    letterSpacing: 2,
    transform: [{ rotate: '90deg' }],
    marginTop: 30,
    width: 80,
    textAlign: 'center',
  },
  bracket: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.whiteOpacity20,
  },
  bracketTopLeft: {
    top: spacing.md,
    left: spacing.md,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 12,
  },
  bracketTopRight: {
    top: spacing.md,
    right: spacing.md,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 12,
  },
  bracketBottomLeft: {
    bottom: spacing.md,
    left: spacing.md,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 12,
  },
  bracketBottomRight: {
    bottom: spacing.md,
    right: spacing.md,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 12,
  },
  selectedTrackChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.overlayLight,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.vibeCyan + '40',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    maxWidth: '80%',
  },
  selectedTrackText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.md,
  },
  modeItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  modeText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.textOpacity60,
    letterSpacing: 1.5,
  },
  modeTextActive: {
    color: colors.vibeCyan,
  },
  modeActiveLine: {
    width: '80%',
    height: 2,
    backgroundColor: colors.vibeCyan,
    marginTop: 4,
    borderRadius: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  footerIconButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.whiteOpacity10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIconButtonActive: {
    borderWidth: 1.5,
    borderColor: colors.vibeCyan,
    backgroundColor: colors.cyanBg,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.vibeCyan,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm_md,
    shadowColor: colors.vibeCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  postButtonText: {
    color: colors.bgDark,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.lg,
  },
  // ──── Music Modal ────
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  musicSheet: {
    backgroundColor: colors.cardDark,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '65%',
    paddingHorizontal: spacing.md,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.overlayBorder,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    marginLeft: spacing.sm,
  },
  trackList: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
