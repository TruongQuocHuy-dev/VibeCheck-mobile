import React from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
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
import { LoadingOverlay } from '../../../../shared/components/feedback/Loading';
import { VibePermissionOverlay } from '../components/VibePermissionOverlay';
import { VibeViewfinder } from '../components/VibeViewfinder';

// vision-camera is imported conditionally since build may not have it yet
let Camera: any;
try {
  const visionCamera = require('react-native-vision-camera');
  Camera = visionCamera.Camera;
} catch {
  Camera = null;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
    setIsCameraReady,
    takePhoto,
    resetPhoto,
    toggleFacing,
    toggleFlash,
    capturedPhoto,
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
    if (displayUri) {
      handleSubmit();
      return;
    }
    const photo = await takePhoto();
    if (photo?.path) {
      handleCapturedPhoto(photo.path);
    }
  }, [displayUri, handleSubmit, takePhoto, handleCapturedPhoto]);

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
    return <VibePermissionOverlay onRequestPermission={requestPermission} onClose={handleClose} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Full-screen loading overlay ── */}
      <LoadingOverlay visible={isSubmitting} message="Đang tải Vibe của bạn..." />

      {/* Hidden audio player */}
      {playingUrl && (
        <Video
          ref={videoRef}
          source={{ uri: playingUrl }}
          ignoreSilentSwitch="ignore"
          playInBackground={false}
          style={styles.hiddenVideo}
          repeat={true}
          progressUpdateInterval={100}
          onProgress={({ currentTime }) => {
            setCurrentPlayTime(currentTime);
            if (currentTime >= startTime + musicDuration) {
              videoRef.current?.seek(startTime);
              setCurrentPlayTime(startTime);
            }
          }}
          onEnd={() => {
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

        <View style={{ flex: 1 }} pointerEvents="box-none">
          <VibeViewfinder
            showCameraFeed={showCameraFeed}
            Camera={Camera}
            cameraRef={cameraRef}
            device={device}
            onCameraInitialized={() => setIsCameraReady(true)}
            displayUri={displayUri}
            previewPhoto={previewPhoto ?? null}
            vibeMode={vibeMode}
            caption={caption}
            onCaptionChange={handleCaptionChange}
            maxCaptionLength={maxCaptionLength}
            activeFilterId={activeFilterId}
            intensity={intensity}
            onApplyFilter={applyFilter}
            location={location}
          />

          <View style={styles.overlayExtras} pointerEvents="box-none">
            {displayUri && vibeMode === 'photo' && (
              <View style={styles.captionRow}>
                <TouchableOpacity style={styles.retakeBtn} onPress={handleRetake}>
                  <Icon name="camera-retake-outline" size={14} color={colors.white} />
                  <Text style={styles.retakeTxt}>Chụp lại</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <Text style={styles.charCounter}>{captionLength}/{maxCaptionLength}</Text>
              </View>
            )}

            {vibeMode === 'text' && (
              <View style={styles.captionRow}>
                <View style={{ flex: 1 }} />
                <Text style={styles.charCounter}>{captionLength}/{maxCaptionLength}</Text>
              </View>
            )}
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
          {!displayUri && (
            <VibeModeSwitcher mode={vibeMode} onModeChange={handleModeSwitch} />
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerIconBtn} onPress={handlePickImage}>
              <Icon name="image-multiple-outline" size={24} color={colors.whiteOpacity80} />
            </TouchableOpacity>

            {canSubmit || displayUri || vibeMode === 'text' ? (
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
  glow: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.75,
    borderRadius: (SCREEN_WIDTH * 0.75) / 2,
    opacity: 0.07,
  },
  glowTL: { top: -SCREEN_WIDTH * 0.2, left: -SCREEN_WIDTH * 0.2, backgroundColor: colors.vibeCyan },
  glowBR: { bottom: -SCREEN_WIDTH * 0.2, right: -SCREEN_WIDTH * 0.2, backgroundColor: colors.vibePurple },
  overlayExtras: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  captionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
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
});
