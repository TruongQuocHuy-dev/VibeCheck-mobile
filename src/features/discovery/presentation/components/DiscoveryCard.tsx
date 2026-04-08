import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme';
import type { Candidate } from '../../domain/types/vibe-card.types';
import { useVibeTags } from '../../application/hooks/useVibeTags';
import Icon from 'react-native-vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CURRENT_YEAR = new Date().getFullYear();

interface DiscoveryCardProps {
  candidate: Candidate;
}

/**
 * Full dating-app style profile card for the swipe detail view.
 * Shows: hero photo → name/age gradient overlay → bio → vibe pills → extra photos.
 */
export const DiscoveryCard = React.memo(({ candidate }: DiscoveryCardProps) => {
  const { resolveVibes } = useVibeTags();
  const age = candidate.birthYear ? CURRENT_YEAR - candidate.birthYear : null;
  const resolvedVibes = resolveVibes(candidate.vibes ?? []);

  return (
    <ScrollView
      style={styles.card}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* ── Hero Photo ── */}
      <View style={styles.heroContainer}>
        {candidate.avatar ? (
          <Image source={{ uri: candidate.avatar }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroImage, styles.heroPlaceholder]} />
        )}

        {/* Gradient overlay at bottom of hero */}
        <LinearGradient
          colors={['transparent', 'rgba(10,10,20,0.92)']}
          style={styles.heroGradient}
        >
          {/* Name & Age */}
          <Text style={styles.nameText}>
            {candidate.fullName || candidate.displayName}
            {age ? (
              <Text style={styles.ageText}>, {age}</Text>
            ) : null}
          </Text>
          <View style={styles.locationContainerCard}>
            <Icon name="location" size={14} color={colors.neonCyan} />
            <Text style={styles.locationTextCard} numberOfLines={1}>
              {candidate.distance ? `Cách bạn ${candidate.distance} km` : 'Gần bạn'}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* ── Info Section ── */}
      <View style={styles.infoSection}>

        {/* Bio */}
        {candidate.bio ? (
          <View style={styles.bioCard}>
            <Text style={styles.sectionLabel}>Giới thiệu</Text>
            <Text style={styles.bioText}>{candidate.bio}</Text>
          </View>
        ) : null}

        {/* Vibe Tags */}
        {resolvedVibes.length > 0 && (
          <View style={styles.vibesSection}>
            <Text style={styles.sectionLabel}>Vibes</Text>
            <View style={styles.vibeRow}>
              {resolvedVibes.map((vibe, i) => (
                <View
                  key={i}
                  style={[
                    styles.vibePill,
                    vibe.colorType === 'pink' ? styles.vibePillPink : styles.vibePillCyan,
                  ]}
                >
                  <Text style={[
                    styles.vibePillText,
                    vibe.colorType === 'pink' ? styles.vibePillTextPink : styles.vibePillTextCyan,
                  ]}>
                    {vibe.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Extra Photos */}
        {(candidate.photos ?? []).length > 0 && (
          <View style={styles.photosSection}>
            <Text style={styles.sectionLabel}>Ảnh thêm</Text>
            {(candidate.photos ?? []).map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.extraPhoto} resizeMode="cover" />
            ))}
          </View>
        )}

        {/* Placeholder photos if none */}
        {(candidate.photos ?? []).length === 0 && (
          <View style={styles.photosSection}>
            <View style={styles.photoPlaceholder} />
            <View style={[styles.photoPlaceholder, { height: 220 }]} />
          </View>
        )}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  scrollContent: {
    paddingBottom: 140, // space for fixed footer buttons
  },
  heroContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.62,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardDark,
  },
  heroPlaceholder: {
    backgroundColor: colors.overlayLight,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xxl,
  },
  nameText: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  ageText: {
    fontSize: 28,
    fontWeight: '400',
    color: colors.textOpacity80,
  },
  locationContainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  locationTextCard: {
    fontSize: typography.sizes.sm,
    color: colors.textOpacity80,
  },
  infoSection: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.textOpacity60,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  bioCard: {
    backgroundColor: colors.overlayLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  bioText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  vibesSection: {
    gap: spacing.sm,
  },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  vibePill: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  vibePillCyan: {
    backgroundColor: colors.cyanBg,
    borderColor: colors.cyanBorder,
  },
  vibePillPink: {
    backgroundColor: colors.pinkBg,
    borderColor: colors.neonPink,
  },
  vibePillText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
  },
  vibePillTextCyan: {
    color: colors.neonCyan,
  },
  vibePillTextPink: {
    color: colors.neonPink,
  },
  photosSection: {
    gap: spacing.md,
  },
  extraPhoto: {
    width: '100%',
    height: 280,
    borderRadius: borderRadius.md,
  },
  photoPlaceholder: {
    width: '100%',
    height: 280,
    borderRadius: borderRadius.md,
    backgroundColor: colors.overlayLight,
  },
});
