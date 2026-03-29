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
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { VibeTrack } from '../../domain/types/create-vibe.types';

interface MusicOptionCardProps {
  track: VibeTrack;
  isSelected: boolean;
  onPress: (track: VibeTrack) => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'card' | 'row';
}

export const MusicOptionCard: React.FC<MusicOptionCardProps> = memo(
  ({ track, isSelected, onPress, style, variant = 'card' }) => {
    const isNoMusic = track.id === 'no-music';

    if (variant === 'row') {
      return (
        <Pressable
          style={[styles.rowWrap, isSelected && styles.rowWrapSelected, style]}
          onPress={() => onPress(track)}
        >
          <View style={[styles.rowCover, isSelected && styles.coverSelected]}>
            {isNoMusic ? (
              <Icon name="musical-notes-outline" size={spacing.md} color={colors.textSecondary} />
            ) : (
              <ImageBackground source={{ uri: track.coverUrl }} style={styles.coverImage} imageStyle={styles.coverImageInner}>
                {!!track.previewUrl && (
                  <View style={styles.playOverlay}>
                    <Icon name="play" size={spacing.md_sm} color={colors.white} />
                  </View>
                )}
              </ImageBackground>
            )}
          </View>
          <View style={styles.rowText}>
            <Text style={styles.title} numberOfLines={1}>{track.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{track.artist || ' '}</Text>
          </View>
          {isSelected && (
            <Icon name="checkmark-circle" size={spacing.lg} color={colors.neonCyan} />
          )}
        </Pressable>
      );
    }

    return (
      <Pressable style={[styles.wrap, style]} onPress={() => onPress(track)}>
        <View style={[styles.cover, isSelected && styles.coverSelected]}>
          {isNoMusic ? (
            <Icon name="musical-notes-outline" size={spacing.md} color={colors.textSecondary} />
          ) : (
            <ImageBackground source={{ uri: track.coverUrl }} style={styles.coverImage} imageStyle={styles.coverImageInner}>
              {!!track.previewUrl && (
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
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowWrapSelected: {
    borderColor: colors.neonCyan + '60',
    backgroundColor: colors.cyanBg,
  },
  rowCover: {
    width: spacing.xl + spacing.xl,
    height: spacing.xl + spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
});

MusicOptionCard.displayName = 'MusicOptionCard';
