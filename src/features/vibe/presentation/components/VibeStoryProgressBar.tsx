import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { colors } from '../../../../core/theme/colors';

interface VibeStoryProgressBarProps {
  stories: any[];
  currentIndex: number;
  progressAnim: Animated.Value;
}

export const VibeStoryProgressBar: React.FC<VibeStoryProgressBarProps> = ({
  stories,
  currentIndex,
  progressAnim,
}) => {
  return (
    <View style={styles.progressRow}>
      {stories.map((_, index) => {
        let width: any = '0%';
        if (index < currentIndex) {
          width = '100%';
        } else if (index === currentIndex) {
          width = progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          });
        }

        return (
          <View key={index} style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width }]} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressTrack: {
    flex: 1,
    height: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.whiteOpacity20,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.white,
    height: '100%',
  },
});
