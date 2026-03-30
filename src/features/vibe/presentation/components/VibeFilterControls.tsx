import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { VIBE_FILTERS } from '../../data/vibe-filters.data';

interface VibeFilterControlsProps {
  activeFilterId: string | null;
  intensity: number;
  onApplyFilter: (id: string) => void;
}

export const VibeFilterControls: React.FC<VibeFilterControlsProps> = ({
  activeFilterId,
  intensity,
  onApplyFilter,
}) => {
  return (
    <>
      {/* Right: filter buttons */}
      <View style={styles.sideControls}>
        {VIBE_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.controlBtn, activeFilterId === f.id && styles.controlBtnActive]}
            onPress={() => onApplyFilter(f.id)}
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
    </>
  );
};

const styles = StyleSheet.create({
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
    gap: 4,
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
});
