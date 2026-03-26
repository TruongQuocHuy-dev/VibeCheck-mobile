import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

interface MarqueeSectionTitleProps {
  title: string;
  showLiveDot?: boolean;
}

export const MarqueeSectionTitle: React.FC<MarqueeSectionTitleProps> = memo(
  ({ title, showLiveDot = true }) => {
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: -120,
            duration: 2600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      loop.start();
      return () => loop.stop();
    }, [translateX]);

    return (
      <View style={styles.wrapper}>
        <View style={styles.clipArea}>
          <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.separator}>  •  </Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.separator}>  •  </Text>
            <Text style={styles.title}>{title}</Text>
          </Animated.View>
        </View>

        {showLiveDot ? <View style={styles.liveDot} /> : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  clipArea: {
    flex: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semiBold,
    letterSpacing: spacing.xs + 1,
  },
  separator: {
    color: colors.neonCyan,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  liveDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.neonCyan,
  },
});

MarqueeSectionTitle.displayName = 'MarqueeSectionTitle';
