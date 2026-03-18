import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../constants/colors';
import { spacing } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { VibeComment } from '../../domain/types/vibe-detail.types';

interface VibeCommentItemProps {
  comment: VibeComment;
}

export const VibeCommentItem: React.FC<VibeCommentItemProps> = memo(({ comment }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: comment.userAvatar }} style={styles.avatar} />

      <View style={styles.contentWrap}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{comment.userName}</Text>
          <Text style={styles.time}>{comment.timeAgo}</Text>
        </View>

        <Text style={styles.content}>{comment.content}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.likeWrap} activeOpacity={0.85}>
            <Icon name="heart" size={spacing.sm_md} color={colors.textMuted} />
            <Text style={styles.actionText}>{comment.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85}>
            <Text style={styles.actionText}>Trả lời</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: spacing.xl + spacing.xs,
    height: spacing.xl + spacing.xs,
    borderRadius: spacing.xl,
    marginRight: spacing.sm_md,
  },
  contentWrap: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  time: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
  },
  content: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    lineHeight: typography.sizes.xxl,
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  likeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
  },
});

VibeCommentItem.displayName = 'VibeCommentItem';
