import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { VibeStat } from '../../domain/types/vibe-detail.types';

interface VibeStatCardProps {
  stat: VibeStat;
}

export const VibeStatCard: React.FC<VibeStatCardProps> = memo(({ stat }) => {
  const valueColor =
    stat.accent === 'primary'
      ? colors.neonCyan
      : stat.accent === 'secondary'
        ? colors.neonPink
        : colors.textPrimary;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{stat.label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{stat.value}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: spacing.xxl + spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: spacing.xs / 2,
  },
  value: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
});

VibeStatCard.displayName = 'VibeStatCard';
