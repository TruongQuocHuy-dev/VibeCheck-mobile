import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useToast } from '../../../../shared/hooks/useToast';
import { useCreateVibe } from '../../application/hooks/useCreateVibe';
import { useVibeCameraView } from '../../application/hooks/useVibeCameraView';
import { VibeCaptureButton } from '../components/VibeCaptureButton';
import { VibeCameraHeader } from '../components/VibeCameraHeader';
import { VibeModeSwitcher } from '../components/VibeModeSwitcher';
import { MusicSelectorModal } from '../components/MusicSelectorModal';

// vision-camera is imported conditionally since build may not have it yet
let Camera: any;
let useCameraDevice: any;
try {
  const visionCamera = require('react-native-vision-camera');
  Camera = visionCamera.Camera;
  useCameraDevice = visionCamera.useCameraDevice;
} catch {
  Camera = null;
}

import { VIBE_FILTERS } from '../../data/vibe-filters.data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FLASH_ICONS: Record<string, string> = {
  off: 'flash-off',
  on: 'flash',
  auto: 'flash-auto',
};

export const CreateVibeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [showMusicModal, setShowMusicModal] = React.useState(false);
  const [currentPlayTime, setCurrentPlayTime] = React.useState(0);

  // ── Toast ──
  const { showToast } = useToast();

  // ── form / upload ──
  const {
    activeFilterId,
    intensity,
    previewPhoto,
    hasImage,
    tracks,
    selectedTrackId,
    isSearchingMusic,
    searchKeyword,
    selectedTrack,
    canSubmit,
    isSubmitting,
    caption,
    captionLength,
    maxCaptionLength,
    location,
    playingTrackId,
    playingTrackUrl,
    startTime,
    musicDuration,
    setStartTime,
    handleClose,
    handlePickImage,
    handleCapturedPhoto,
    handleSubmit,
    handleTrackSelect,
    handleStopPreview,
    handleCaptionChange,
    vibeMode,
    switchMode,
    fetchDefaultTracks,
    applyFilter,
    setSearchKeyword,
  } = useCreateVibe(showToast);

  // ── camera ──
  const videoRef = React.useRef<any>(null);
  const {
    cameraRef,
    device,
    hasPermission,
    requestPermission,
    flash,
    facing,
    isCameraReady,
    capturedPhoto,
    setIsCameraReady,
    takePhoto,
    resetPhoto,
    toggleFacing,
    toggleFlash,
  } = useVibeCameraView();

  const displayUri = capturedPhoto
    ? `file://${capturedPhoto.path}`
    : previewPhoto ?? null;

  const showCameraFeed = !displayUri;

  // Playing track's URL for audio
  const playingUrl = React.useMemo(() => {
    if (!playingTrackId) return null;
    return tracks.find((t) => t.id === playingTrackId)?.previewUrl ?? null;
  }, [playingTrackId, tracks]);

  const handleCapturePress = React.useCallback(async () => {
    // Already have a photo → submit
    if (capturedPhoto || previewPhoto) {
      handleSubmit();
      return;
    }
    // Take photo with in-app camera
    const photo = await takePhoto();
    if (photo?.path) {
      // Register the captured photo with the form hook so handleSubmit can upload it
      handleCapturedPhoto(photo.path);
    }
  }, [capturedPhoto, previewPhoto, handleSubmit, takePhoto, handleCapturedPhoto]);

  const handleRetake = React.useCallback(() => {
    resetPhoto();
  }, [resetPhoto]);

  const handleModeSwitch = React.useCallback((mode: 'photo' | 'text') => {
    switchMode(mode);
    if (mode === 'text') {
      resetPhoto();
    }
  }, [switchMode, resetPhoto]);

  const openMusicModal = React.useCallback(() => {
    setShowMusicModal(true);
    fetchDefaultTracks();
  }, [fetchDefaultTracks]);

  const handleMusicClose = React.useCallback(() => {
    setShowMusicModal(false);
    handleStopPreview();
  }, [handleStopPreview]);

  // Sync video to startTime when it changes
  React.useEffect(() => {
    if (playingTrackId && videoRef.current) {
      videoRef.current.seek(startTime);
      setCurrentPlayTime(startTime);
    }
  }, [startTime, playingTrackId]);

  // ── Permission screen ──
  if (!hasPermission) {
    return (
      <View style={styles.permScreen}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Icon name="camera-off" size={64} color={colors.textMuted} />
        <Text style={styles.permTitle}>Cần quyền Camera</Text>
        <Text style={styles.permSub}>VibeCheck cần truy cập camera để chụp Vibe của bạn.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnTxt}>Cấp quyền</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.permCancel} onPress={handleClose}>
          <Text style={styles.permCancelTxt}>Để sau</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Full-screen loading overlay ── */}
      <Modal visible={isSubmitting} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.vibeCyan} />
            <Text style={styles.loadingTitle}>Đang đăng Vibe...</Text>
            <Text style={styles.loadingSubtitle}>Vui lòng chờ trong giây lát</Text>
          </View>
        </View>
      </Modal>

      {/* Hidden audio player */}
      {playingUrl && (
        <Video
          ref={videoRef}
          source={{ uri: playingUrl }}
          ignoreSilentSwitch="ignore"
          playInBackground={false}
          style={styles.hiddenVideo}
          repeat={true}
          progressUpdateInterval={100} // update 10 times a second for smooth animation
          onProgress={({ currentTime }) => {
            setCurrentPlayTime(currentTime);
            // Loop back to startTime if it exceeds the 20s window
            if (currentTime >= startTime + musicDuration) {
              videoRef.current?.seek(startTime);
              setCurrentPlayTime(startTime);
            }
          }}
          onEnd={() => {
            // Failsafe loop if track ends
            videoRef.current?.seek(startTime);
            setCurrentPlayTime(startTime);
          }}
        />
      )}

      {/* Ambient glows */}
      <View style={[styles.glow, styles.glowTL]} />
      <View style={[styles.glow, styles.glowBR]} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

        {/* ══ Header ══ */}
        <VibeCameraHeader
          flash={flash}
          facing={facing}
          toggleFlash={toggleFlash}
          onFlip={toggleFacing}
          onClose={handleClose}
          isLiveCamera={!displayUri && vibeMode === 'photo'}
        />

        {/* ══ Viewfinder ══ */}
        <View style={styles.vfContainer}>
          <View style={styles.vfWrapper}>

            {/* Live camera */}
            {showCameraFeed && Camera && device && (
              <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive
                photo
                onInitialized={() => setIsCameraReady(true)}
              />
            )}

            {/* Captured / gallery photo or Text Mode Background */}
            {(!!previewPhoto || vibeMode === 'text') && (
              previewPhoto ? (
                <Image source={{ uri: previewPhoto }} style={styles.capturedImg} resizeMode="cover" />
              ) : (
                <LinearGradient
                  colors={[colors.vibeGradientStart, colors.vibeGradientEnd]}
                  style={[styles.capturedImg, styles.textModeContainer]}
                >
                  <TextInput
                    style={styles.textModeInput}
                    placeholder="Bạn đang nghĩ gì?..."
                    placeholderTextColor={colors.textOpacity60}
                    value={caption}
                    onChangeText={handleCaptionChange}
                    maxLength={maxCaptionLength}
                    multiline
                    blurOnSubmit
                    textAlign="center"
                  />
                </LinearGradient>
              )
            )}

            {/* No camera device */}
            {showCameraFeed && (!Camera || !device) && (
              <View style={styles.noDevice}>
                <ActivityIndicator color={colors.vibeCyan} size="large" />
                <Text style={styles.noDeviceTxt}>Đang khởi động camera...</Text>
              </View>
            )}

            {/* ── Filter colour overlay ── */}
            {activeFilterId && (
              <LinearGradient
                colors={VIBE_FILTERS.find(f => f.id === activeFilterId)?.colors as any || []}
                style={styles.filterOverlay}
                pointerEvents="none"
              />
            )}

            {/* ── UI Overlay ── */}
            <View style={styles.overlay} pointerEvents="box-none">

              {/* Right: filter buttons from data */}
              <View style={styles.sideControls}>
                {VIBE_FILTERS.map((f) => (
                  <TouchableOpacity
                    key={f.id}
                    style={[styles.controlBtn, activeFilterId === f.id && styles.controlBtnActive]}
                    onPress={() => applyFilter(f.id)}
                  >
                    <Icon name={f.icon} size={20} color={colors.white} />
                    <Text style={styles.controlBtnLabel}>{f.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Left: intensity meter */}
              <View style={styles.intensityWrap}>
                <View style={styles.meterTrack}>
                  <LinearGradient
                    colors={[colors.vibeGradientEnd, colors.vibeGradientStart]}
                    style={[styles.meterFill, { height: `${intensity * 100}%` as any }]}
                  />
                </View>
                <Text style={styles.intensityLabel}>INTENSITY</Text>
              </View>

              {/* Brackets */}
              <View style={[styles.bracket, styles.bTL]} />
              <View style={[styles.bracket, styles.bTR]} />
              <View style={[styles.bracket, styles.bBL]} />
              <View style={[styles.bracket, styles.bBR]} />

                <View style={[styles.vfBottom, { bottom: displayUri ? 10 : 80 }]} pointerEvents="box-none">
                  {location && location.area && (
                    <View style={styles.locationPill}>
                      <Icon name="map-marker-outline" size={12} color={colors.vibeCyan} />
                      <Text style={styles.locationTxt}>{location.area}</Text>
                    </View>
                  )}

                  {vibeMode === 'photo' && (
                    <>
                      <TextInput
                        style={styles.captionInput}
                        placeholder="Thêm caption..."
                        placeholderTextColor={colors.textOpacity60}
                        value={caption}
                        onChangeText={handleCaptionChange}
                        maxLength={maxCaptionLength}
                        multiline
                        blurOnSubmit
                      />
                      <View style={styles.captionRow}>
                        {displayUri && (
                          <TouchableOpacity style={styles.retakeBtn} onPress={handleRetake}>
                            <Icon name="camera-retake-outline" size={14} color={colors.white} />
                            <Text style={styles.retakeTxt}>Chụp lại</Text>
                          </TouchableOpacity>
                        )}
                        <View style={{ flex: 1 }} />
                        <Text style={styles.charCounter}>{captionLength}/{maxCaptionLength}</Text>
                      </View>
                    </>
                  )}

                  {vibeMode === 'text' && (
                    <View style={styles.captionRow}>
                      <View style={{ flex: 1 }} />
                      <Text style={styles.charCounter}>{captionLength}/{maxCaptionLength}</Text>
                    </View>
                  )}
                </View>
            </View>
          </View>

          {/* Track chip */}
          {selectedTrack && (
            <TouchableOpacity style={styles.trackChip} onPress={openMusicModal}>
              <Icon name="music-note" size={14} color={colors.vibeCyan} />
              <Text style={styles.trackChipTxt} numberOfLines={1}>
                {selectedTrack.title} · {selectedTrack.artist} ({musicDuration}s)
              </Text>
              <Icon name="chevron-right" size={14} color={colors.textOpacity60} />
            </TouchableOpacity>
          )}
        </View>

        {/* ══ Bottom Action Bar ══ */}
        <View style={styles.footerContainer}>
          {/* Mode Switcher */}
          {!displayUri && (
            <VibeModeSwitcher mode={vibeMode} onModeChange={handleModeSwitch} />
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerIconBtn} onPress={handlePickImage}>
              <Icon name="image-multiple-outline" size={24} color={colors.whiteOpacity80} />
            </TouchableOpacity>

            {canSubmit || capturedPhoto || vibeMode === 'text' ? (
              <TouchableOpacity
                style={[styles.postButton, !canSubmit && { opacity: 0.5 }]}
                onPress={vibeMode === 'text' ? handleSubmit : handleCapturePress}
                disabled={isSubmitting || !canSubmit}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.bgDark} />
                ) : (
                  <>
                    <Icon name="send" size={20} color={colors.bgDark} />
                    <Text style={styles.postBtnTxt}>Đăng Vibe</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <VibeCaptureButton onPress={handleCapturePress} />
            )}

            <TouchableOpacity
              style={[styles.footerIconBtn, !!selectedTrack && styles.footerIconBtnActive]}
              onPress={openMusicModal}
            >
              <Icon
                name="music-note"
                size={24}
                color={selectedTrack ? colors.vibeCyan : colors.whiteOpacity80}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* ══ Music Modal ══ */}
      <MusicSelectorModal
        visible={showMusicModal}
        onClose={handleMusicClose}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        tracks={tracks}
        isSearching={isSearchingMusic}
        selectedTrackId={selectedTrackId}
        playingTrackId={playingTrackId}
        selectedTrack={selectedTrack}
        onTrackSelect={handleTrackSelect}
        startTime={startTime}
        musicDuration={musicDuration}
        currentPlayTime={currentPlayTime}
        onStartTimeChange={setStartTime}
        bottomInset={insets.bottom}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceLow },
  safeArea: { flex: 1 },
  hiddenVideo: { width: 0, height: 0, position: 'absolute' },

  // Permission
  permScreen: {
    flex: 1,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  permTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  permSub: {
    color: colors.textSecondary,
    fontSize: typography.sizes.lg,
    textAlign: 'center',
  },
  permBtn: {
    backgroundColor: colors.vibeCyan,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm_md,
    marginTop: spacing.md,
  },
  permBtnTxt: {
    color: colors.bgDark,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.lg,
  },
  permCancel: { marginTop: spacing.sm },
  permCancelTxt: { color: colors.textMuted, fontSize: typography.sizes.lg },

  // Ambient
  glow: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    borderRadius: (SCREEN_WIDTH * 0.75) / 2,
    opacity: 0.07,
  },
  glowTL: { top: -SCREEN_WIDTH * 0.2, left: -SCREEN_WIDTH * 0.2, backgroundColor: colors.vibeCyan },
  glowBR: { bottom: -SCREEN_WIDTH * 0.2, right: -SCREEN_WIDTH * 0.2, backgroundColor: colors.vibePurple },

  // Viewfinder
  vfContainer: { flex: 1, paddingHorizontal: spacing.md, justifyContent: 'center' },
  vfWrapper: {
    aspectRatio: 3 / 4,
    width: '100%',
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.vibePurpleOpacity30,
    overflow: 'hidden',
    backgroundColor: colors.bgBlack,
  },
  camera: { ...StyleSheet.absoluteFillObject },
  capturedImg: { ...StyleSheet.absoluteFillObject },
  noDevice: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  noDeviceTxt: { color: colors.textSecondary, fontSize: typography.sizes.lg },

  // Filter overlay
  filterOverlay: { ...StyleSheet.absoluteFillObject },

  // UI overlay
  overlay: { ...StyleSheet.absoluteFillObject, padding: spacing.md },

  // Filter side controls
  sideControls: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    gap: spacing.sm,
  },
  controlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.vibeOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    gap: spacing.xs,
  },
  controlBtnActive: {
    backgroundColor: colors.vibePurpleOpacity40,
    borderColor: colors.vibePurple,
    borderWidth: 2,
  },
  controlBtnLabel: {
    fontSize: 8,
    color: colors.white,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },

  // Intensity meter
  intensityWrap: {
    position: 'absolute',
    left: spacing.md,
    top: '25%',
    alignItems: 'center',
  },
  meterTrack: {
    width: 2,
    height: 110,
    backgroundColor: colors.overlayBorder,
    borderRadius: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  meterFill: { width: '100%', borderRadius: 1 },
  intensityLabel: {
    fontSize: 9,
    color: colors.textOpacity60,
    fontWeight: typography.weights.bold,
    letterSpacing: 2,
    transform: [{ rotate: '90deg' }],
    marginTop: 34,
    width: 75,
    textAlign: 'center',
  },

  // Brackets
  bracket: { position: 'absolute', width: spacing.lg, height: spacing.lg, borderColor: colors.whiteOpacity20 },
  bTL: { top: spacing.sm, left: spacing.sm, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: spacing.sm_md },
  bTR: { top: spacing.sm, right: spacing.sm, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: spacing.sm_md },
  bBL: { bottom: spacing.sm, left: spacing.sm, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: spacing.sm_md },
  bBR: { bottom: spacing.sm, right: spacing.sm, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: spacing.sm_md },

  // Bottom overlay
  vfBottom: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    gap: spacing.xs,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.cyanBg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  locationTxt: {
    color: colors.vibeCyan,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semiBold,
  },
  captionInput: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    textShadowColor: colors.vibeOverlayDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    maxHeight: 80,
    paddingVertical: 0,
  },
  captionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.whiteOpacity10,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  retakeTxt: { color: colors.white, fontSize: typography.sizes.xs, fontWeight: typography.weights.semiBold },
  charCounter: { color: colors.textOpacity60, fontSize: typography.sizes.xs },

  // Text Mode specific
  textModeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  textModeInput: {
    color: colors.white,
    fontSize: typography.sizes.xxxl,
    lineHeight: 40,
    fontWeight: typography.weights.bold,
    width: '100%',
    padding: spacing.md,
  },

  // Track chip
  trackChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs + 2,
    backgroundColor: colors.overlayLight,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.whiteOpacity20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    maxWidth: '80%',
  },
  trackChipTxt: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },

  // Footer
  footerContainer: {
    paddingBottom: spacing.lg,
    backgroundColor: 'transparent',
    gap: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  footerIconBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.whiteOpacity10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIconBtnActive: {
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
    shadowOpacity: 0.55,
    shadowRadius: spacing.md,
    elevation: spacing.sm_md,
  },
  postBtnTxt: {
    color: colors.bgDark,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.md,
  },

  // ── Loading overlay ──
  loadingOverlay: {
    flex: 1,
    backgroundColor: colors.vibeOverlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.whiteOpacity20,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: colors.vibeCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: spacing.lg,
    elevation: spacing.md_sm,
  },
  loadingTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  loadingSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
  },
});
