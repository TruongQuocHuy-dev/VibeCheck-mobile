import React from 'react';
import { View, Text, Image, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { VibeFilterControls } from './VibeFilterControls';
import { VIBE_FILTERS } from '../../data/vibe-filters.data';

interface VibeViewfinderProps {
  showCameraFeed: boolean;
  Camera: any;
  cameraRef: any;
  device: any;
  onCameraInitialized: () => void;
  displayUri: string | null;
  previewPhoto: string | null;
  vibeMode: 'photo' | 'text';
  caption: string;
  onCaptionChange: (text: string) => void;
  maxCaptionLength: number;
  activeFilterId: string | null;
  intensity: number;
  onApplyFilter: (id: string) => void;
  location: any;
}

export const VibeViewfinder: React.FC<VibeViewfinderProps> = ({
  showCameraFeed,
  Camera,
  cameraRef,
  device,
  onCameraInitialized,
  displayUri,
  previewPhoto,
  vibeMode,
  caption,
  onCaptionChange,
  maxCaptionLength,
  activeFilterId,
  intensity,
  onApplyFilter,
  location,
}) => {
  return (
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
            onInitialized={onCameraInitialized}
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
                onChangeText={onCaptionChange}
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

        {/* Filter colour overlay */}
        {activeFilterId && (
          <LinearGradient
            colors={VIBE_FILTERS.find(f => f.id === activeFilterId)?.colors as any || []}
            style={styles.filterOverlay}
            pointerEvents="none"
          />
        )}

        {/* UI Overlay */}
        <View style={styles.overlay} pointerEvents="box-none">
          <VibeFilterControls
            activeFilterId={activeFilterId}
            intensity={intensity}
            onApplyFilter={onApplyFilter}
          />

          {/* Brackets */}
          <View style={[styles.bracket, styles.bTL]} />
          <View style={[styles.bracket, styles.bTR]} />
          <View style={[styles.bracket, styles.bBL]} />
          <View style={[styles.bracket, styles.bBR]} />

          <View style={[styles.vfBottom, { bottom: displayUri ? spacing.sm : 80 }]} pointerEvents="box-none">
            {location && location.area && (
              <View style={styles.locationPill}>
                <Icon name="map-marker-outline" size={12} color={colors.vibeCyan} />
                <Text style={styles.locationTxt}>{location.area}</Text>
              </View>
            )}

            {vibeMode === 'photo' && !!displayUri && (
              <TextInput
                style={styles.captionInput}
                placeholder="Thêm caption..."
                placeholderTextColor={colors.textOpacity60}
                value={caption}
                onChangeText={onCaptionChange}
                maxLength={maxCaptionLength}
                multiline
                blurOnSubmit
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  vfContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
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
  filterOverlay: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, padding: spacing.md },
  bracket: { position: 'absolute', width: spacing.lg, height: spacing.lg, borderColor: colors.whiteOpacity20 },
  bTL: { top: spacing.sm, left: spacing.sm, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: spacing.sm_md },
  bTR: { top: spacing.sm, right: spacing.sm, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: spacing.sm_md },
  bBL: { bottom: spacing.sm, left: spacing.sm, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: spacing.sm_md },
  bBR: { bottom: spacing.sm, right: spacing.sm, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: spacing.sm_md },
  vfBottom: {
    position: 'absolute',
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
  textModeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  textModeInput: {
    color: colors.white,
    fontSize: typography.sizes.xxl,
    lineHeight: 32,
    fontWeight: typography.weights.bold,
    width: '100%',
    padding: spacing.md,
  },
});
