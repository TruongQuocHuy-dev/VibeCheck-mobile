import React, { memo } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

interface OwnVibeStoryCardProps {
  avatar: string;
  backgroundImage?: string | null;
  hasStory: boolean;
  onPress: () => void;
  onAddPress: () => void;
}

export const OwnVibeStoryCard: React.FC<OwnVibeStoryCardProps> = memo(
  ({ avatar, backgroundImage, hasStory, onPress, onAddPress }) => {
    return (
      <View style={styles.gradientBorder}>
        <Pressable style={styles.cardInner} onPress={onPress}>
          <ImageBackground
            source={{ uri: backgroundImage || avatar }}
            style={styles.cardImage}
            imageStyle={styles.cardImageInner}
            blurRadius={hasStory ? 3 : 0}
          >
            <View style={styles.overlay}>
              <View style={styles.topRow}>
                {hasStory ? (
                  <View style={styles.timePill}>
                    <Text style={styles.timeText}>24h</Text>
                  </View>
                ) : (
                  <View style={styles.emptyPill}>
                    <Text style={styles.emptyPillText}>THÊM</Text>
                  </View>
                )}
              </View>

              <View style={styles.bottomRow}>
                <Image source={{ uri: avatar }} style={styles.ownerAvatar} />
                <Text style={styles.ownerName} numberOfLines={1}>
                  Bản thân bạn
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.addBadge} onPress={onAddPress}>
              <Icon name="add" size={spacing.md} color={colors.white} />
            </TouchableOpacity>
          </ImageBackground>
        </Pressable>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  gradientBorder: {
    width: 152,
    height: 232,
    borderRadius: borderRadius.lg,
    padding: 2,
    marginRight: spacing.md,
    backgroundColor: colors.primary,
  },
  cardInner: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.cardDark,
  },
  cardImage: {
    flex: 1,
  },
  cardImageInner: {
    borderRadius: borderRadius.lg,
    opacity: 0.85,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.sm,
    backgroundColor: colors.blurDark,
  },
  topRow: {
    alignItems: 'flex-end',
  },
  timePill: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.blurDark,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  timeText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  emptyPill: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.overlayLight,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  emptyPillText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.whiteOpacity20,
    marginRight: spacing.sm,
  },
  ownerName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  addBadge: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.xl,
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.neonCyan,
    borderWidth: 2,
    borderColor: colors.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

OwnVibeStoryCard.displayName = 'OwnVibeStoryCard';
