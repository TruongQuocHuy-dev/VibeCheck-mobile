import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { getTimeRemaining } from '../../../../core/utils/time';

interface VibeStoryHeaderProps {
  detail: any;
  isMuted: boolean;
  toggleMute: () => void;
  handleMenuPress: () => void;
  handleBack: () => void;
  handleProfilePress: () => void;
}

export const VibeStoryHeader: React.FC<VibeStoryHeaderProps> = ({
  detail,
  isMuted,
  toggleMute,
  handleMenuPress,
  handleBack,
  handleProfilePress,
}) => {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity style={styles.ownerInfo} activeOpacity={0.9} onPress={handleProfilePress}>
        <Image 
          source={{ uri: detail.ownerAvatar || 'https://via.placeholder.com/150' }} 
          style={styles.ownerAvatar} 
        />
        <View style={styles.ownerTextWrap}>
          <View style={styles.ownerNameRow}>
            <Text style={styles.ownerName} numberOfLines={1}>{detail.ownerName}</Text>
            <Text style={styles.ownerTimeDot}>•</Text>
            <Text style={styles.ownerTimeText}>{getTimeRemaining(detail.expiresAt)}</Text>
          </View>
          {detail.track && (
            <View style={styles.headerMusicWrap}>
              <Icon name="musical-note" size={spacing.sm} color={colors.neonCyan} />
              <Text style={styles.headerMusicText} numberOfLines={1}>
                {detail.track.title} • {detail.track.artist}
              </Text>
            </View>
          )}
          {detail.location && (
            <View style={styles.headerMusicWrap}>
              <Icon name="location-sharp" size={spacing.sm} color={colors.vibeCyan} />
              <Text style={styles.headerMusicText} numberOfLines={1}>
                {typeof detail.location === 'object' ? detail.location.area : detail.location}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleMute} activeOpacity={0.85}>
          <Icon name={isMuted ? "volume-mute" : "volume-high"} size={spacing.lg} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.85}>
          <Icon name="ellipsis-horizontal" size={spacing.lg} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleBack} activeOpacity={0.85}>
          <Icon name="close" size={spacing.lg} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ownerAvatar: {
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.white,
    marginRight: spacing.sm,
  },
  ownerTextWrap: {
    flex: 1,
  },
  ownerName: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    flexShrink: 1,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ownerTimeDot: {
    color: colors.textOpacity60,
    fontSize: spacing.sm,
  },
  ownerTimeText: {
    color: colors.textOpacity80,
    fontSize: typography.sizes.sm,
  },
  headerMusicWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  headerMusicText: {
    color: colors.neonCyan,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    textShadowColor: colors.blurDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  iconButton: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.blurLight,
  },
});
