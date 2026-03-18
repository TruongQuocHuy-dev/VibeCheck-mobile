import React, { memo } from 'react';
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { PastVibeItem } from '../../domain/types/profile.types';

interface PastVibeCardProps {
  item: PastVibeItem;
  style?: StyleProp<ViewStyle>;
}

export const PastVibeCard: React.FC<PastVibeCardProps> = memo(({ item, style }) => {
  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.image}
        imageStyle={styles.imageInner}
        blurRadius={2}
      >
        <View style={styles.overlay}>
          <Text style={styles.status}>{item.statusLabel}</Text>
        </View>
      </ImageBackground>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgTooltip,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  imageInner: {
    borderRadius: borderRadius.lg,
    opacity: 0.65,
  },
  overlay: {
    alignSelf: 'center',
    backgroundColor: colors.blurDark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  status: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
});

PastVibeCard.displayName = 'PastVibeCard';
