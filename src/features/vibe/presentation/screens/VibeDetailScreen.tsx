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
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useVibeDetail } from '../../application/hooks/useVibeDetail';
import { VibeStoryHeader } from '../components/VibeStoryHeader';
import { VibeStoryProgressBar } from '../components/VibeStoryProgressBar';
import { VibeReactionsBar } from '../components/VibeReactionsBar';
import { VibeInteractionModal } from '../components/VibeInteractionModal';

export const VibeDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const videoRef = React.useRef<any>(null);
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
    isOwner,
    interactions,
    viewCount,
    isInteractionsLoading,
    showInteractions,
    setShowInteractions,
    fetchInteractions,
    toggleMute,
    handlePressIn,
    handlePressOut,
  } = useVibeDetail();


  if (!detail) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.vibeCyan} />
        <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Đang tải Vibe...</Text>
      </View>
    );
  }

  const renderStoryContent = () => {
    if (!detail) return null;

    return (
      <>
        <LinearGradient
          colors={['rgba(0,0,0,0.65)', 'rgba(0,0,0,0.15)']}
          style={[styles.topOverlay, { paddingTop: insets.top + spacing.xs }]}
        >
          <VibeStoryProgressBar
            stories={stories}
            currentIndex={currentIndex}
            progressAnim={progressAnim}
          />

          <VibeStoryHeader
            detail={detail}
            isMuted={isMuted}
            toggleMute={toggleMute}
            handleMenuPress={handleMenuPress}
            handleBack={handleBack}
            handleProfilePress={handleProfilePress}
          />
        </LinearGradient>

        {/* Music Video Playback */}
        {detail.track?.previewUrl && (
          <Video
            ref={videoRef}
            source={{ uri: detail.track.previewUrl }}
            repeat={true}
            muted={isMuted}
            style={{ width: 0, height: 0 }}
            onLoad={() => {
              if (detail.track?.startTime) {
                videoRef.current?.seek(detail.track.startTime);
              }
            }}
            progressUpdateInterval={100}
            onProgress={({ currentTime }) => {
              const start = detail.track?.startTime || 0;
              const duration = detail.track?.musicDuration || 20;
              if (currentTime >= start + duration) {
                videoRef.current?.seek(start);
              }
            }}
            onEnd={() => {
              const start = detail.track?.startTime || 0;
              videoRef.current?.seek(start);
            }}
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

          {isOwner && (
            <TouchableOpacity 
              style={styles.viewerButton} 
              onPress={() => setShowInteractions(true)}
            >
              <View style={styles.viewerIconList}>
                {interactions.slice(0, 3).map((inter, idx) => (
                  <Image 
                    key={inter._id || `viewer-${idx}`} 
                    source={{ uri: inter.sender?.avatar }} 
                    style={[styles.viewerTinyAvatar, { marginLeft: idx > 0 ? -spacing.sm : 0, zIndex: 10 - idx }]} 
                  />
                ))}
              </View>
              <Text style={styles.viewerCount}>
                {interactions.length > 0 ? `${interactions.length} lượt tương tác` : 'Chưa có tương tác'}
              </Text>
              <Icon name="chevron-up" size={spacing.md} color={colors.textOpacity60} />
            </TouchableOpacity>
          )}

          {!isOwner && (
            <VibeReactionsBar
              quickReactions={quickReactions}
              selectedReaction={selectedReaction}
              replyInput={replyInput}
              setReplyInput={setReplyInput}
              handleReactionPress={handleReactionPress}
              handleSendReply={handleSendReply}
            />
          )}
        </LinearGradient>

        <VibeInteractionModal
          visible={showInteractions}
          onClose={() => setShowInteractions(false)}
          interactions={interactions}
          viewCount={viewCount}
          isLoading={isInteractionsLoading}
          onRefresh={fetchInteractions}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {detail.backgroundImage ? (
        <ImageBackground source={{ uri: detail.backgroundImage }} style={styles.storyBackground} blurRadius={0}>
          {renderStoryContent()}
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={[colors.vibeGradientStart, colors.vibeGradientEnd]}
          style={styles.storyBackground}
        >
          {renderStoryContent()}
        </LinearGradient>
      )}
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
    zIndex: 10, // Ensure it's on top of touch navigation area
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
  viewerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    gap: 8,
  },
  viewerIconList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerTinyAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.bgDark,
  },
  viewerCount: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.cardDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    height: '60%',
    borderWidth: 1,
    borderColor: colors.cyanBorder,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.whiteOpacity20,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.overlayBorder,
  },
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  refreshText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  interactionsList: {
    padding: 20,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
  },
  viewerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.neonCyan,
  },
  interactionInfo: {
    flex: 1,
  },
  viewerName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  interactionText: {
    fontSize: 13,
    color: colors.textOpacity60,
    marginBottom: 4,
  },
  reactionsBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reactionEmojiText: {
    fontSize: 16,
  },
  reactionMoreText: {
    fontSize: 12,
    color: colors.textOpacity60,
    marginLeft: 2,
  },
  interactionTimeWrap: {
    alignItems: 'flex-end',
  },
  interactionTime: {
    fontSize: 11,
    color: colors.textOpacity60,
  },
  emptyInteractionsWrap: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyInteractions: {
    fontSize: 14,
    color: colors.textOpacity60,
    textAlign: 'center',
  },
});
