import React from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useVibeDetail } from '../../application/hooks/useVibeDetail';

export const VibeDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    detail,
    storySegments,
    quickReactions,
    replyInput,
    selectedReaction,
    setReplyInput,
    handleBack,
    handleProfilePress,
    handleMenuPress,
    handleSendReply,
    handleReactionPress,
    currentIndex,
    stories,
    progressAnim,
    handleNext,
    handlePrev,
    isMuted,
    toggleMute,
    handlePressIn,
    handlePressOut,
  } = useVibeDetail();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground source={{ uri: detail.backgroundImage }} style={styles.storyBackground} blurRadius={0}>
        <LinearGradient
          colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.15)']}
          style={[styles.topOverlay, { paddingTop: insets.top + spacing.xs }]}
        >
          <View style={styles.progressRow}>
            {stories.map((_, index) => {
              let width: any = '0%';
              if (index < currentIndex) width = '100%';
              else if (index === currentIndex) {
                width = progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                });
              }

              return (
                <View key={index} style={styles.progressTrack}>
                  <Animated.View style={[styles.progressFill, { width }]} />
                </View>
              );
            })}
          </View>

          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.ownerInfo} activeOpacity={0.9} onPress={handleProfilePress}>
              <Image source={{ uri: detail.ownerAvatar || 'https://via.placeholder.com/150' }} style={styles.ownerAvatar} />
              <View style={styles.ownerTextWrap}>
                <View style={styles.ownerNameRow}>
                  <Text style={styles.ownerName} numberOfLines={1}>{detail.ownerName}</Text>
                  <Text style={styles.ownerTimeDot}>•</Text>
                  <Text style={styles.ownerTimeText}>{detail.expiresIn}</Text>
                </View>
                {detail.track && (
                  <View style={styles.headerMusicWrap}>
                    <Icon name="musical-note" size={spacing.sm} color={colors.neonCyan} />
                    <Text style={styles.headerMusicText} numberOfLines={1}>
                      {detail.track.title} • {detail.track.artist}
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
        </LinearGradient>

        {/* Music Video Playback */}
        {detail.track?.previewUrl && (
          <Video
            source={{ uri: detail.track.previewUrl }}
            repeat={true}
            muted={isMuted}
            style={{ width: 0, height: 0 }}
          />
        )}

        {/* Touch zones for navigation */}
        <View style={styles.touchAreaContainer}>
          <TouchableOpacity
            style={styles.touchLeft}
            onPress={handlePrev}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          />
          <TouchableOpacity
            style={styles.touchRight}
            onPress={handleNext}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          />
        </View>

        <View style={styles.centerBlock}>
          {/* Focal area for the image/story content */}
        </View>

        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          style={[styles.bottomOverlay, { paddingBottom: insets.bottom + spacing.md }]}
        >
          {detail.caption ? (
            <Text style={styles.captionText}>{detail.caption}</Text>
          ) : null}

          <View style={styles.reactionsRow}>
            {quickReactions.map((item) => {
              const active = selectedReaction === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.reactionButton, active && styles.reactionButtonActive]}
                  onPress={() => handleReactionPress(item.id)}
                  activeOpacity={0.88}
                >
                  <Icon
                    name={item.icon}
                    size={spacing.md}
                    color={active ? colors.bgDark : colors.textPrimary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.replyBar}>
            <View style={styles.replyInputWrap}>
              <TextInput
                value={replyInput}
                onChangeText={setReplyInput}
                style={styles.replyInput}
                placeholder="Tra loi vibe..."
                placeholderTextColor={colors.textOpacity60}
              />
              <Icon name="camera-outline" size={spacing.md} color={colors.textOpacity80} />
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSendReply} activeOpacity={0.9}>
              <Icon name="send" size={spacing.md_sm} color={colors.bgDark} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  storyBackground: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topOverlay: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressTrack: {
    flex: 1,
    height: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.whiteOpacity20,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.white,
    height: '100%',
  },
  touchAreaContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 1, // Above background but below overlays?
  },
  touchLeft: {
    width: '30%',
    height: '100%',
  },
  touchRight: {
    width: '70%',
    height: '100%',
  },
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
    flexShrink: 1, // Allow name to shrink if too long
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerTimeDot: {
    color: colors.textOpacity60,
    fontSize: spacing.sm,
  },
  ownerTimeText: {
    color: colors.textOpacity80,
    fontSize: typography.sizes.sm,
  },
  ownerMeta: {
    color: colors.textOpacity80,
    fontSize: typography.sizes.md,
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerMusicWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  headerMusicText: {
    color: colors.neonCyan,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    textShadowColor: 'rgba(0,0,0,0.5)',
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
  centerBlock: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  captionText: {
    color: colors.white,
    fontSize: typography.sizes.xl,
    lineHeight: typography.sizes.xxl,
    fontWeight: typography.weights.semiBold,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: spacing.sm,
  },
  metaPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaPill: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.blurLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  metaPillText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
  },
  musicCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: 'rgba(255,255,255,0.88)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    maxWidth: spacing.xxl + spacing.xxl + spacing.xxl + spacing.xl,
  },
  musicTextWrap: {
    flex: 1,
  },
  musicTitle: {
    color: colors.bgDark,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  musicArtist: {
    color: colors.textDark,
    fontSize: typography.sizes.sm,
  },
  bottomOverlay: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  reactionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  reactionButton: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.blurLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionButtonActive: {
    backgroundColor: colors.neonCyan,
    borderColor: colors.neonCyan,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  replyInputWrap: {
    flex: 1,
    minHeight: spacing.xxl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.blurLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  replyInput: {
    flex: 1,
    color: colors.white,
    fontSize: typography.sizes.lg,
  },
  sendButton: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neonCyan,
  },
});
