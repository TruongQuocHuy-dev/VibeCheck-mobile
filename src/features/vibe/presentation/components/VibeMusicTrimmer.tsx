import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

interface VibeMusicTrimmerProps {
  startTime: number;
  musicDuration: number;
  currentPlayTime: number;
  isPlaying: boolean;
  onStartTimeChange: (value: number) => void;
}

export const VibeMusicTrimmer: React.FC<VibeMusicTrimmerProps> = ({
  startTime,
  musicDuration,
  currentPlayTime,
  isPlaying,
  onStartTimeChange,
}) => {
  return (
    <View style={styles.modalTrimmerWrap}>
      <View style={styles.trimmerHeader}>
        <Icon name="music-clef-treble" size={16} color={colors.vibeCyan} />
        <Text style={styles.trimmerHeaderText}>Cắt đoạn nhạc ({musicDuration}s)</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.trimmerTimeText}>
          0:{Math.floor(startTime).toString().padStart(2, '0')} - 0:
          {Math.floor(startTime + musicDuration).toString().padStart(2, '0')}
        </Text>
      </View>

      {/* Custom visual timeline */}
      <View style={styles.timelineContainer}>
        {/* Background track representing 30s */}
        <View style={styles.timelineBg} />
        {/* Highlighted window representing window duration (e.g. 20s) */}
        <View
          style={[
            styles.timelineHighlight,
            {
              left: `${(startTime / 30) * 100}%`,
              width: `${(musicDuration / 30) * 100}%`,
            },
          ]}
        />

        {/* Playhead indicator moving within the 30s track */}
        {isPlaying && (
          <View
            style={[
              styles.timelinePlayhead,
              {
                left: `${(currentPlayTime / 30) * 100}%`,
              },
            ]}
          />
        )}

        {/* Invisible slider on top to control startTime (0-10s) */}
        <Slider
          style={StyleSheet.absoluteFillObject}
          minimumValue={0}
          maximumValue={30 - musicDuration} // Max start allows for a full window within 30s
          step={0.5}
          value={startTime}
          onValueChange={onStartTimeChange}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor={colors.vibeCyan}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTrimmerWrap: {
    backgroundColor: colors.vibeCardDark,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  trimmerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  trimmerHeaderText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  trimmerTimeText: {
    color: colors.vibeCyan,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    fontVariant: ['tabular-nums'],
  },
  timelineContainer: {
    height: 36,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  timelineBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: colors.whiteOpacity10,
    borderRadius: 6,
  },
  timelineHighlight: {
    position: 'absolute',
    height: 16,
    backgroundColor: colors.vibeCyan + '80',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.vibeCyan,
  },
  timelinePlayhead: {
    position: 'absolute',
    height: 18,
    width: 2,
    backgroundColor: colors.white,
    borderRadius: 1,
    zIndex: 10,
  },
});
