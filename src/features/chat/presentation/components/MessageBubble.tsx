import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Pressable, 
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Message } from '../../domain/types/chat.types';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius as br } from '../../../../core/theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const audioPlaybackInstance = new AudioRecorderPlayer();

interface MessageBubbleProps {
  message: Message;
  isPrevSameSender: boolean;
  isNextSameSender: boolean;
  onLongPress: (message: Message) => void;
  onDoubleTap: (message: Message) => void;
  onReplyPress: (message: Message) => void;
  onImagePress?: (index: number, mediaList: any[]) => void;
  isReadByOther?: boolean;
}

const AudioPlayer: React.FC<{ uri: string; isMe: boolean }> = ({ uri, isMe }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');

  // Generate 25 random bars for mock waveform
  const waveformBars = useRef(Array.from({ length: 25 }, () => Math.random() * 20 + 8)).current;

  const onStartPlay = async () => {
    try {
      setIsPlaying(true);
      await audioPlaybackInstance.startPlayer(uri);
      audioPlaybackInstance.addPlayBackListener((e) => {
        setCurrentPositionSec(e.currentPosition);
        setCurrentDurationSec(e.duration);
        setPlayTime(audioPlaybackInstance.mmssss(Math.floor(e.currentPosition)));
        setDuration(audioPlaybackInstance.mmssss(Math.floor(e.duration)));
        if (e.currentPosition === e.duration) {
          onStopPlay();
        }
      });
    } catch (err) {
      setIsPlaying(false);
    }
  };

  const onPausePlay = async () => {
    await audioPlaybackInstance.pausePlayer();
    setIsPlaying(false);
  };

  const onStopPlay = async () => {
    await audioPlaybackInstance.stopPlayer();
    audioPlaybackInstance.removePlayBackListener();
    setIsPlaying(false);
    setCurrentPositionSec(0);
  };

  useEffect(() => {
    return () => {
      audioPlaybackInstance.stopPlayer();
      audioPlaybackInstance.removePlayBackListener();
    };
  }, []);

  const progress = currentDurationSec > 0 ? (currentPositionSec / currentDurationSec) : 0;

  return (
    <View style={styles.threadsAudioRow}>
      <TouchableOpacity 
        onPress={isPlaying ? onPausePlay : onStartPlay} 
        style={[styles.threadsPlayBtn, isMe ? styles.threadsPlayBtnMe : styles.threadsPlayBtnPartner]}
      >
        <Icon 
          name={isPlaying ? "pause-sharp" : "play-sharp"} 
          size={18} 
          color={isMe ? colors.messengerBlue : colors.white} 
        />
      </TouchableOpacity>
      
      <View style={styles.threadsWaveform}>
        {waveformBars.map((height, i) => {
          const isFilled = i / waveformBars.length <= progress;
          return (
            <View 
              key={i} 
              style={[
                styles.waveformBar, 
                { height },
                isFilled 
                  ? (isMe ? styles.barFilledMe : styles.barFilledPartner)
                  : (isMe ? styles.barEmptyMe : styles.barEmptyPartner)
              ]} 
            />
          );
        })}
      </View>
      <Text style={[styles.threadsAudioTime, isMe ? styles.threadsTimeMe : styles.threadsTimePartner]}>
        {isPlaying ? playTime : duration}
      </Text>
    </View>
  );
};

// Simple internal Touchable for AudioPlayer to avoid re-imports
const TouchableOpacity = (props: any) => <Pressable {...props} style={({ pressed }) => [props.style, { opacity: pressed ? 0.7 : 1 }]} />;

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isPrevSameSender,
  isNextSameSender,
  onLongPress,
  onDoubleTap,
  onReplyPress,
  onImagePress,
  isReadByOther,
}) => {
  const { content, type, sender, reactions, replyTo, status, mediaUrl, mediaList } = message;
  const isMe = !!message.isMe;

  const renderPhotoStack = () => {
    if (!mediaList || mediaList.length <= 1) {
      return (
        <Pressable 
          style={styles.imageWrapper} 
          onPress={() => handlePress(() => (mediaUrl || content) && onImagePress?.(0, [{ url: mediaUrl || content }]))}
          onLongPress={() => onLongPress(message)}
        >
          <Image
            source={{ uri: mediaUrl || content }}
            style={styles.fullImage}
            resizeMode="cover"
          />
          {status === 'sending' && (
            <View style={styles.imageOverlay}>
              <ActivityIndicator color={colors.white} />
            </View>
          )}
        </Pressable>
      );
    }

    // Stack UI: Limit visible to 3 for the 'stack' effect
    const visiblePhotos = mediaList.slice(0, 3).reverse();
    
    return (
      <View style={styles.stackOuterContainer}>
        {isMe && (
          <Text style={styles.stackLabel}>Bạn đã gửi {mediaList.length} ảnh</Text>
        )}
        <Pressable 
          style={styles.stackContainer} 
          onPress={() => handlePress(() => onImagePress?.(0, mediaList))}
          onLongPress={() => onLongPress(message)}
        >
          {visiblePhotos.map((item, idx) => {
            const indexFromTop = visiblePhotos.length - 1 - idx;
            // First item (top) at 0, then 3, then -5 deg rotation
            // Increased rotation and offset for better 'stack' effect
            const rotate = indexFromTop === 0 ? '-3deg' : indexFromTop === 1 ? '5deg' : '-9deg';
            const offset = indexFromTop * 12;

            return (
              <View 
                key={idx}
                style={[
                  styles.stackedImageWrapper,
                  { 
                    transform: [{ rotate }],
                    zIndex: visiblePhotos.length - indexFromTop,
                    top: offset,
                    left: indexFromTop % 2 === 0 ? offset / 1.5 : -offset / 2, // Alternating left/right offset
                  }
                ]}
              >
                <Image source={{ uri: item.url }} style={styles.stackedImage} resizeMode="cover" />
              </View>
            );
          })}
        </Pressable>
      </View>
    );
  };

  const lastTap = useRef(0);
  const handlePress = (singleTapHandler?: () => void) => {
    if (message.isRecalled?.status) return;
    const now = Date.now();
    if (now - lastTap.current < 300) {
      onDoubleTap(message);
    } else {
      if (singleTapHandler) singleTapHandler();
    }
    lastTap.current = now;
  };

  const renderReactions = () => {
    if (!reactions || reactions.length === 0) return null;
    const uniqueEmojis = Array.from(new Set(reactions.map(r => r.emoji))).slice(0, 3);
    return (
      <View style={styles.reactionPill}>
        <View style={styles.reactionEmojiRow}>
          {uniqueEmojis.map((emoji, idx) => (
            <View key={idx} style={[styles.reactionIconWrapper, { marginLeft: idx === 0 ? 0 : -spacing.xs }]}>
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </View>
          ))}
        </View>
        {reactions.length > 1 && (
          <Text style={styles.reactionCount}>{reactions.length}</Text>
        )}
      </View>
    );
  };

  const renderReplyReference = () => {
    if (!replyTo) return null;
    return (
      <View style={styles.replyReference}>
        <View style={styles.replyRefBar} />
        <View style={styles.replyRefContent}>
          <Text style={styles.replyRefSender} numberOfLines={1}>
            {!!replyTo.isMe ? 'Bạn' : (replyTo.sender as any)?.fullName || 'Người dùng'}
          </Text>
          <Text style={styles.replyRefText} numberOfLines={1}>
            {replyTo.content}
          </Text>
        </View>
      </View>
    );
  };

  const hasReactions = reactions && reactions.length > 0;

  return (
    <View style={[styles.outerRow, isNextSameSender ? styles.narrowMargin : styles.wideMargin]}>
      <View style={styles.avatarSlot}>
        {!isMe && !isNextSameSender && (
          <Image
            source={{ uri: (sender as any)?.avatar || 'https://ui-avatars.com/api/?name=User' }}
            style={styles.avatar}
          />
        )}
      </View>

      <View style={[styles.bubbleColumn, isMe ? styles.bubbleColumnRight : styles.bubbleColumnLeft]}>
        {renderReplyReference()}

        <View style={[styles.bubbleArea, hasReactions && styles.bubbleAreaWithReactions]}>
          <Pressable
            onLongPress={() => onLongPress(message)}
            onPress={() => handlePress()}
            style={[
              styles.bubble,
              isMe ? styles.bubbleMe : styles.bubblePartner,
              !isNextSameSender && (isMe ? styles.bubbleMeTail : styles.bubblePartnerTail),
              !message.isRecalled?.status && (type === 'image' || type === 'story_reply' || type === 'audio') && styles.bubbleMedia,
            ]}
          >
            {message.isRecalled?.status ? (
              <Text style={[styles.messageText, styles.recalledText]}>
                Tin nhắn đã được thu hồi
              </Text>
            ) : (
              <View>
                {type === 'text' && (
                  <Text style={[styles.messageText, isMe ? styles.textMe : styles.textPartner]}>
                    {content}
                  </Text>
                )}

                {type === 'audio' && mediaUrl && (
                  <AudioPlayer uri={mediaUrl} isMe={isMe} />
                )}

                {type === 'image' && (
                  <View style={styles.mediaContainer}>
                    {renderPhotoStack()}
                  </View>
                )}

                {type === 'story_reply' && (
                  <View style={styles.storyReply}>
                    <View style={styles.storyRef}>
                      <Image source={{ uri: message.storyReference?.imageUrl }} style={styles.storyImg} />
                      <View style={styles.storyTextWrapper}>
                        <Text style={styles.storyReplyLabel} numberOfLines={1}>Tin của bạn</Text>
                        <Text style={styles.storyCaption} numberOfLines={1}>
                          {message.storyReference?.caption || 'Xem tin'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.storyContentWrapper}>
                      <Text style={[styles.messageText, isMe ? styles.textMe : styles.textPartner]}>
                        {content}
                      </Text>
                    </View>
                  </View>
                )}

                </View>
              )}
            </Pressable>

          {isMe && !isPrevSameSender && (
            <View style={styles.statusIconContainer}>
              {status === 'sending' ? (
                <Icon name="ellipse-outline" size={14} color={colors.messengerBlue} />
              ) : status === 'error' ? (
                <Icon name="alert-circle" size={16} color={colors.error} />
              ) : (
                !(message.readBy?.some(id => id !== message.sender._id)) ? (
                  <Icon 
                    name={message.deliveredBy?.some(id => id !== message.sender._id) ? "checkmark-circle" : "checkmark-circle-outline"} 
                    size={14} 
                    color={colors.messengerBlue} 
                  />
                ) : null
              )}
            </View>
          )}

          {hasReactions && (
            <View style={[styles.reactionContainer, isMe ? styles.reactionRight : styles.reactionLeft]}>
              {renderReactions()}
            </View>
          )}
        </View>
      </View>

      {!isMe && <View style={styles.rightSpacer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  outerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: spacing.sm,
  },
  narrowMargin: { marginBottom: spacing.xs / 2 },
  wideMargin: { marginBottom: spacing.md_sm },
  avatarSlot: { width: 32, marginRight: spacing.sm, alignItems: 'center', justifyContent: 'flex-end' },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  bubbleColumn: { flex: 1, maxWidth: '75%' },
  bubbleColumnLeft: { alignItems: 'flex-start' },
  bubbleColumnRight: { alignItems: 'flex-end', marginLeft: 'auto', maxWidth: '82%' },
  rightSpacer: { width: spacing.xxl },
  bubbleArea: { position: 'relative', paddingBottom: spacing.sm },
  bubbleAreaWithReactions: { paddingBottom: spacing.lg + spacing.xs },
  bubble: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm_md, borderRadius: br.lg + 2 },
  bubbleMe: { backgroundColor: colors.messengerBlue },
  bubblePartner: { backgroundColor: colors.surfaceMedium },
  bubbleMeTail: { borderBottomRightRadius: spacing.xs },
  bubblePartnerTail: { borderBottomLeftRadius: spacing.xs },
  bubbleMedia: { 
    paddingHorizontal: 0, 
    paddingVertical: 0, 
    overflow: 'hidden', 
    borderRadius: br.lg + 2,
    backgroundColor: 'transparent' 
  },
  messageText: { fontSize: 15, lineHeight: 21 },
  textMe: { color: colors.white },
  textPartner: { color: colors.textPrimary },
  recalledText: { color: colors.textSecondary, fontStyle: 'italic', fontSize: 14, opacity: 0.7 },
  mediaContainer: { overflow: 'visible' },
  imageWrapper: { position: 'relative', borderRadius: br.lg + 2, overflow: 'hidden' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: 240, height: 300 },
  
  // Stack UI
  stackOuterContainer: {
    paddingTop: spacing.sm,
    width: 200,
    alignItems: 'flex-end',
  },
  stackLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.md,
    fontFamily: 'Outfit-Medium',
  },
  stackContainer: {
    width: 170,
    height: 220,
    position: 'relative',
    marginBottom: spacing.lg,
  },
  stackedImageWrapper: {
    position: 'absolute',
    width: 160,
    height: 210,
    borderRadius: br.md,
    backgroundColor: colors.surfaceMedium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stackedImage: {
    width: '100%',
    height: '100%',
  },
  gridItem: {
    width: '100%',
    height: 200,
  },
  gridItemHalf: {
    width: 119,
    height: 150,
  },
  gridItemSmall: {
    width: 119,
    height: 119,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  storyReply: { width: 230 },
  storyRef: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm_md, padding: spacing.sm, backgroundColor: colors.blurLight, borderTopLeftRadius: br.lg + 2, borderTopRightRadius: br.lg + 2 },
  storyImg: { width: 40, height: 56, borderRadius: br.sm - 3 },
  storyTextWrapper: { flex: 1 },
  storyReplyLabel: { fontSize: 12, fontWeight: 'bold', color: colors.white, marginBottom: 2 },
  storyCaption: { fontSize: 11, color: colors.textSecondary },
  storyContentWrapper: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm_md },
  statusIconContainer: { 
    position: 'absolute', 
    right: -2, 
    bottom: -2, 
    backgroundColor: colors.bgDark, 
    borderRadius: 8,
    padding: 1,
  },
  reactionContainer: { position: 'absolute', bottom: 0, zIndex: 10 },
  reactionLeft: { left: spacing.sm },
  reactionRight: { right: spacing.sm },
  reactionPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfacePill, paddingHorizontal: 6, paddingVertical: 2, borderRadius: br.md, borderWidth: 1.5, borderColor: colors.borderDark, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  reactionEmojiRow: { flexDirection: 'row', alignItems: 'center' },
  reactionIconWrapper: { borderRadius: br.sm + 2, backgroundColor: colors.surfacePill },
  reactionEmoji: { fontSize: 13 },
  reactionCount: { fontSize: 10.5, color: colors.textSecondary, marginLeft: 3, fontWeight: '600' },
  replyReference: { flexDirection: 'row', marginBottom: spacing.xs - 1, paddingHorizontal: spacing.sm_md, paddingVertical: spacing.sm - 2, backgroundColor: colors.blurLight, borderRadius: br.md, maxWidth: '100%', alignSelf: 'stretch' },
  replyRefBar: { width: 2, backgroundColor: colors.messengerBlue, marginRight: spacing.sm, borderRadius: 1 },
  replyRefContent: { flex: 1 },
  replyRefSender: { fontSize: 11, fontWeight: 'bold', color: colors.messengerBlue, marginBottom: 1 },
  replyRefText: { fontSize: 11, color: colors.textSecondary },
  // Threads-style Audio Player
  threadsAudioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    width: 220,
    minHeight: 52,
  },
  threadsPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  threadsPlayBtnMe: { backgroundColor: colors.white },
  threadsPlayBtnPartner: { backgroundColor: colors.messengerBlue },
  threadsWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginHorizontal: spacing.sm,
    gap: 2,
  },
  waveformBar: {
    width: 2.5,
    borderRadius: 1.25,
  },
  barFilledMe: { backgroundColor: colors.white },
  barFilledPartner: { backgroundColor: colors.messengerBlue },
  barEmptyMe: { backgroundColor: 'rgba(255,255,255,0.4)' },
  barEmptyPartner: { backgroundColor: 'rgba(0,132,255,0.1)' },
  threadsAudioTime: {
    fontSize: 10,
    fontWeight: 'bold',
    minWidth: 32,
    textAlign: 'center',
  },
  threadsTimeMe: { color: colors.white },
  threadsTimePartner: { color: colors.textSecondary },
});
