import React, { memo } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../../../../constants/colors';
import { spacing, borderRadius } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { UserStat } from '../../domain/types/profile.types';

interface ProfileStatItemProps {
  stat: UserStat;
  style?: StyleProp<ViewStyle>;
}

export const ProfileStatItem: React.FC<ProfileStatItemProps> = memo(({ stat, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.value}>{stat.value}</Text>
      <Text style={styles.label}>{stat.label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  value: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: spacing.xs / 2,
  },
});

ProfileStatItem.displayName = 'ProfileStatItem';
