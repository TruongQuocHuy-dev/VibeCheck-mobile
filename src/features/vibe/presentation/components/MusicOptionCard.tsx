import React, { memo } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { VibeTrack } from '../../domain/types/create-vibe.types';

interface MusicOptionCardProps {
  track: VibeTrack;
  isSelected: boolean;
  onPress: (track: VibeTrack) => void;
  style?: StyleProp<ViewStyle>;
}

export const MusicOptionCard: React.FC<MusicOptionCardProps> = memo(
  ({ track, isSelected, onPress, style }) => {
    const isNoMusic = track.id === 'no-music';

    return (
      <Pressable style={[styles.wrap, style]} onPress={() => onPress(track)}>
        <View style={[styles.cover, isSelected && styles.coverSelected]}>
          {isNoMusic ? (
            <Icon name="musical-notes-outline" size={spacing.md} color={colors.textSecondary} />
          ) : (
            <ImageBackground source={{ uri: track.artwork }} style={styles.coverImage} imageStyle={styles.coverImageInner}>
              {track.previewType === 'play' && (
                <View style={styles.playOverlay}>
                  <Icon name="play" size={spacing.md_sm} color={colors.white} />
                </View>
              )}
            </ImageBackground>
          )}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist || ' '}
        </Text>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  wrap: {
    width: spacing.xl + spacing.xl,
    marginRight: spacing.md,
  },
  cover: {
    width: spacing.xl + spacing.xl,
    height: spacing.xl + spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  coverSelected: {
    borderColor: colors.primary,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverImageInner: {
    borderRadius: borderRadius.md,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cyanBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  artist: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
  },
});

MusicOptionCard.displayName = 'MusicOptionCard';
