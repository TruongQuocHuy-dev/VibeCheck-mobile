import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

interface VibeCameraHeaderProps {
  flash: 'on' | 'off' | 'auto';
  facing: 'front' | 'back';
  toggleFlash: () => void;
  onFlip?: () => void;
  onClose: () => void;
  isLiveCamera: boolean;
}

const FLASH_ICONS = {
  off: 'flash-off',
  on: 'flash',
  auto: 'flash-auto',
} as const;

export const VibeCameraHeader: React.FC<VibeCameraHeaderProps> = ({
  flash,
  facing,
  toggleFlash,
  onFlip,
  onClose,
  isLiveCamera,
}) => {
  return (
    <View style={styles.header}>
      {/* Left: Always CLOSE (X) */}
      <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
        <Icon name="close" size={26} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.centerContainer}>
        <Text style={styles.logoText}>VibeCheck</Text>
      </View>

      {/* Right: Camera Controls (Flash & Flip) */}
      <View style={styles.rightControls}>
        {isLiveCamera && (
          <>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                flash === 'on' && styles.iconBtnFlashOn,
                flash === 'auto' && styles.iconBtnFlashAuto,
                facing === 'front' && styles.iconBtnDisabled,
              ]}
              onPress={toggleFlash}
              disabled={facing === 'front'}
            >
              <Icon
                name={FLASH_ICONS[flash]}
                size={22}
                color={flash === 'on' ? colors.bgDark : colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={onFlip}>
              <Icon name="camera-flip-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 60,
  },
  centerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  iconBtnFlashOn: {
    backgroundColor: colors.vibeCyan,
    borderColor: colors.vibeCyan,
  },
  iconBtnFlashAuto: {
    backgroundColor: colors.accent + 'BB',
    borderColor: colors.accent,
  },
  iconBtnDisabled: {
    opacity: 0.35,
  },
  logoText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.heavy,
    color: colors.vibeCyan,
    letterSpacing: -0.3,
  },
});
