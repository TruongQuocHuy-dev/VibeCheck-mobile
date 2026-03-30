import React, { memo, useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { VibeTrack } from '../../domain/types/create-vibe.types';

interface MusicOptionCardProps {
  track: VibeTrack;
  isSelected: boolean;
  isPlaying?: boolean;
  onPress: (track: VibeTrack) => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'card' | 'row';
}

const PulseRing: React.FC = () => {
  const pulse = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.5, duration: 700, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse, opacity]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.pulseRing,
        { transform: [{ scale: pulse }], opacity },
      ]}
    />
  );
};

const WaveBar: React.FC<{ delay: number }> = ({ delay }) => {
  const height = useRef(new Animated.Value(4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(height, {
          toValue: 16 + Math.random() * 8,
          duration: 300 + delay * 50,
          useNativeDriver: false,
        }),
        Animated.timing(height, {
          toValue: 4,
          duration: 300 + delay * 50,
          useNativeDriver: false,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [height, delay]);

  return (
    <Animated.View
      style={[styles.waveBar, { height }]}
    />
  );
};

export const MusicOptionCard: React.FC<MusicOptionCardProps> = memo(
  ({ track, isSelected, isPlaying = false, onPress, style, variant = 'card' }) => {
    const isNoMusic = track.id === 'no-music';

    if (variant === 'row') {
      return (
        <Pressable
          style={[styles.rowWrap, isSelected && styles.rowWrapSelected, style]}
          onPress={() => onPress(track)}
        >
          {/* Cover art */}
          <View style={[styles.rowCover, isSelected && styles.coverSelected]}>
            {isNoMusic ? (
              <Icon name="music-note-off" size={24} color={colors.textSecondary} />
            ) : (
              <ImageBackground
                source={{ uri: track.coverUrl }}
                style={styles.coverImage}
                imageStyle={styles.coverImageInner}
              >
                {/* Pulse ring when playing */}
                {isPlaying && <PulseRing />}
                {/* Play/pause icon overlay */}
                <View style={styles.playOverlay}>
                  <Icon
                    name={isPlaying ? 'pause' : 'play'}
                    size={18}
                    color={colors.white}
                  />
                </View>
              </ImageBackground>
            )}
          </View>

          {/* Text */}
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, isSelected && styles.rowTitleActive]} numberOfLines={1}>
              {track.title}
            </Text>
            <Text style={styles.rowArtist} numberOfLines={1}>
              {track.artist || 'Không có nhạc'}
            </Text>
          </View>

          {/* Right side: wave animation or duration badge */}
          {isPlaying ? (
            <View style={styles.waveContainer}>
              {[0, 1, 2, 3].map((i) => <WaveBar key={i} delay={i} />)}
            </View>
          ) : (
            <View style={styles.rowRightSide}>
              {!isNoMusic && track.previewUrl && (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>30s</Text>
                </View>
              )}
              {isSelected ? (
                <Icon name="check-circle" size={22} color={colors.vibeCyan} />
              ) : track.previewUrl ? (
                <Icon name="play-circle-outline" size={22} color={colors.textMuted} />
              ) : null}
            </View>
          )}
        </Pressable>
      );
    }

    // Card variant (horizontal scroll)
    return (
      <Pressable style={[styles.wrap, style]} onPress={() => onPress(track)}>
        <View style={[styles.cover, isSelected && styles.coverSelected]}>
          {isNoMusic ? (
            <Icon name="music-note-off" size={spacing.md} color={colors.textSecondary} />
          ) : (
            <ImageBackground
              source={{ uri: track.coverUrl }}
              style={styles.coverImage}
              imageStyle={styles.coverImageInner}
            >
              {isPlaying && <PulseRing />}
              {!!track.previewUrl && (
                <View style={styles.playOverlay}>
                  <Icon
                    name={isPlaying ? 'pause' : 'play'}
                    size={spacing.md_sm}
                    color={colors.white}
                  />
                </View>
              )}
            </ImageBackground>
          )}
        </View>
        <Text style={[styles.title, isSelected && styles.rowTitleActive]} numberOfLines={1}>
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
  // ── Card variant ──
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
    borderColor: colors.vibeCyan,
    borderWidth: 2,
  },
  coverImage: { width: '100%', height: '100%' },
  coverImageInner: { borderRadius: borderRadius.md },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.vibeCyan,
  },
  title: { color: colors.textPrimary, fontSize: typography.sizes.xs, fontWeight: typography.weights.bold },
  artist: { color: colors.textSecondary, fontSize: typography.sizes.xs },

  // ── Row variant ──
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  rowWrapSelected: {
    borderColor: colors.vibeCyan + '50',
    backgroundColor: colors.cyanBg,
  },
  rowCover: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
  },
  rowTitleActive: {
    color: colors.vibeCyan,
  },
  rowArtist: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
  },

  // Wave animation
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 24,
    paddingHorizontal: 2,
  },
  waveBar: {
    width: 3,
    backgroundColor: colors.vibeCyan,
    borderRadius: 2,
    alignSelf: 'center',
  },
  rowRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  durationBadge: {
    backgroundColor: colors.whiteOpacity10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: colors.whiteOpacity20,
  },
  durationText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
});

MusicOptionCard.displayName = 'MusicOptionCard';
