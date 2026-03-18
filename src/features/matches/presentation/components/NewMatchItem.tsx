import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { NewMatchUser } from '../../domain/types/matches.types';

interface NewMatchItemProps {
  user: NewMatchUser;
  onPress: (user: NewMatchUser) => void;
}

export const NewMatchItem: React.FC<NewMatchItemProps> = memo(({ user, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={() => onPress(user)}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />

        {user.isOnline && <View style={styles.onlineDot} />}
        {user.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>

      <Text style={styles.nameText}>{`${user.name}, ${user.age}`}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: spacing.xxl + spacing.lg,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarWrap: {
    width: spacing.xxl + spacing.lg,
    height: spacing.xxl + spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 2,
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  onlineDot: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: spacing.md_sm,
    height: spacing.md_sm,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.bgDark,
    backgroundColor: colors.success,
  },
  newBadge: {
    position: 'absolute',
    top: -spacing.xs,
    right: -spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  nameText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
});

NewMatchItem.displayName = 'NewMatchItem';
