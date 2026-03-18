import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { VibeReactionUser } from '../../domain/types/vibe-detail.types';

interface ReactionAvatarBadgeProps {
  user: VibeReactionUser;
}

export const ReactionAvatarBadge: React.FC<ReactionAvatarBadgeProps> = memo(({ user }) => {
  const ringColor =
    user.ring === 'primary'
      ? colors.neonCyan
      : user.ring === 'secondary'
        ? colors.neonPink
        : colors.overlayBorder;

  return (
    <View style={styles.wrap}>
      <View style={[styles.avatarRing, { borderColor: ringColor }]}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      </View>

      <View style={styles.reactionBadge}>
        <Icon
          name={user.reaction === 'heart' ? 'heart' : 'flame'}
          size={spacing.sm_md}
          color={user.reaction === 'heart' ? colors.error : colors.warning}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    marginRight: spacing.md,
  },
  avatarRing: {
    width: spacing.xxl + spacing.sm,
    height: spacing.xxl + spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    padding: 2,
    backgroundColor: colors.cardDark,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  reactionBadge: {
    position: 'absolute',
    right: -spacing.xs,
    bottom: -spacing.xs,
    width: spacing.lg + spacing.xs,
    height: spacing.lg + spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ReactionAvatarBadge.displayName = 'ReactionAvatarBadge';
