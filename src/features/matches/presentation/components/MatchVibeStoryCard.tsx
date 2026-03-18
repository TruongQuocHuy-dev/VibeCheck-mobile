import React, { memo } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { MatchVibeStory } from '../../domain/types/matches.types';

interface MatchVibeStoryCardProps {
  story: MatchVibeStory;
  onPress: (story: MatchVibeStory) => void;
}

export const MatchVibeStoryCard: React.FC<MatchVibeStoryCardProps> = memo(({ story, onPress }) => {
  return (
    <View style={styles.gradientBorder}>
      <Pressable style={styles.cardInner} onPress={() => onPress(story)}>
        <ImageBackground
          source={{ uri: story.backgroundImage }}
          style={styles.cardImage}
          imageStyle={styles.cardImageInner}
          blurRadius={6}
        >
          <View style={styles.overlay}>
            <View style={styles.topRow}>
              <View style={styles.iconRow}>
                {story.hasMusic && <Icon name="musical-note" size={spacing.md_sm} color={colors.white} />}
                {story.hasLocation && <Icon name="location" size={spacing.md_sm} color={colors.white} />}
              </View>

              <View style={styles.timePill}>
                <Text style={styles.timeText}>{story.expiresIn}</Text>
              </View>
            </View>

            <View style={styles.bottomRow}>
              <Image source={{ uri: story.ownerAvatar }} style={styles.ownerAvatar} />
              <Text style={styles.ownerName} numberOfLines={1}>
                {story.ownerName}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </View>
  );
});

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
    opacity: 0.78,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.sm,
    backgroundColor: colors.blurDark,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconRow: {
    flexDirection: 'row',
    gap: spacing.xs,
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
});

MatchVibeStoryCard.displayName = 'MatchVibeStoryCard';
