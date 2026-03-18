import React, { memo } from 'react';
import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { NotificationItem } from '../../domain/types/notification.types';

interface NotificationItemCardProps {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
  onLongPress?: (item: NotificationItem) => void;
  isSelected?: boolean;
  selectionMode?: boolean;
  style?: StyleProp<ViewStyle>;
}

const kindIconMap: Record<NotificationItem['kind'], string> = {
  match: 'heart',
  message: 'chatbubble',
  like: 'star',
  system: 'flash',
};

const kindColorMap: Record<NotificationItem['kind'], string> = {
  match: colors.primary,
  message: colors.neonCyan,
  like: colors.textSecondary,
  system: colors.textSecondary,
};

const kindRingMap: Record<NotificationItem['kind'], string> = {
  match: colors.primary,
  message: colors.neonCyan,
  like: colors.overlayBorder,
  system: colors.overlayBorder,
};

export const NotificationItemCard: React.FC<NotificationItemCardProps> = memo(
  ({ item, onPress, onLongPress, isSelected, selectionMode, style }) => {
  const ringColor = kindRingMap[item.kind];
  const iconColor = kindColorMap[item.kind];

  const highlightedMessage = item.highlightText
    ? item.message.split(item.highlightText)
    : null;

  return (
    <Pressable
      style={[
        styles.card,
        item.dimmed && styles.cardDimmed,
        selectionMode && styles.cardSelectionMode,
        isSelected && styles.cardSelected,
        style,
      ]}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress?.(item)}
      android_ripple={{ color: colors.overlayLight }}
    >
      <View style={styles.avatarWrap}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={[styles.avatar, { borderColor: ringColor }]} />
        ) : (
          <View style={styles.systemAvatar}>
            <Icon name="flash" size={spacing.lg} color={colors.textSecondary} />
          </View>
        )}

        <View style={styles.kindBadge}>
          <Icon name={kindIconMap[item.kind]} size={spacing.md_sm} color={iconColor} />
        </View>
      </View>

      <View style={styles.contentWrap}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.timeText}>{item.timeLabel}</Text>
        </View>

        {highlightedMessage ? (
          <Text style={styles.message} numberOfLines={1}>
            {highlightedMessage[0]}
            <Text style={styles.highlight}>{item.highlightText}</Text>
            {highlightedMessage[1] || ''}
          </Text>
        ) : (
          <Text
            style={[styles.message, item.kind === 'message' && styles.messageItalic]}
            numberOfLines={1}
          >
            {item.kind === 'message' ? `\"${item.message}\"` : item.message}
          </Text>
        )}
      </View>

      {selectionMode ? (
        <View style={[styles.selectDot, isSelected && styles.selectDotActive]}>
          {isSelected && <Icon name="checkmark" size={spacing.sm_md} color={colors.bgDark} />}
        </View>
      ) : (
        item.isUnread && <View style={styles.unreadDot} />
      )}
    </Pressable>
  );
  },
);

const styles = StyleSheet.create({
  card: {
    minHeight: spacing.xxl + spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.overlayLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm_md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSelectionMode: {
    borderColor: colors.cyanBorder,
  },
  cardSelected: {
    borderColor: colors.neonCyan,
    backgroundColor: colors.cyanBg,
  },
  cardDimmed: {
    opacity: 0.72,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: borderRadius.full,
    borderWidth: 2,
  },
  systemAvatar: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: borderRadius.full,
    backgroundColor: colors.bgTooltip,
    borderWidth: 2,
    borderColor: colors.overlayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindBadge: {
    position: 'absolute',
    right: -spacing.xs,
    bottom: -spacing.xs,
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrap: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    flex: 1,
  },
  timeText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    textTransform: 'uppercase',
    letterSpacing: spacing.xs / 2,
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  messageItalic: {
    fontStyle: 'italic',
  },
  highlight: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  unreadDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neonCyan,
    marginLeft: spacing.sm,
  },
  selectDot: {
    width: spacing.md,
    height: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    marginLeft: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgTooltip,
  },
  selectDotActive: {
    backgroundColor: colors.neonCyan,
    borderColor: colors.neonCyan,
  },
});

NotificationItemCard.displayName = 'NotificationItemCard';
