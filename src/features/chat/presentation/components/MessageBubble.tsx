import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Message } from '../../domain/types/chat.types';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius as br } from '../../../../core/theme/spacing';

interface MessageBubbleProps {
  message: Message;
  isPrevSameSender: boolean;
  isNextSameSender: boolean;
  onLongPress: (message: Message) => void;
  onDoubleTap: (message: Message) => void;
  onReplyPress: (message: Message) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isPrevSameSender,
  isNextSameSender,
  onLongPress,
  onDoubleTap,
  onReplyPress,
}) => {
  const { isMe, content, type, sender, reactions, replyTo, status } = message;

  // Double-tap logic via ref
  const lastTap = useRef(0);
  const handlePress = () => {
    if (message.isRecalled?.status) return;
    const now = Date.now();
    if (now - lastTap.current < 300) {
      onDoubleTap(message);
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
            {replyTo.isMe ? 'Bạn' : (replyTo.sender as any)?.fullName || 'Người dùng'}
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
      {/* Avatar slot */}
      <View style={styles.avatarSlot}>
        {!isMe && !isNextSameSender && (
          <Image
            source={{ uri: (sender as any)?.avatar || 'https://ui-avatars.com/api/?name=User' }}
            style={styles.avatar}
          />
        )}
      </View>

      {/* Bubble column */}
      <View style={[styles.bubbleColumn, isMe ? styles.bubbleColumnRight : styles.bubbleColumnLeft]}>
        {renderReplyReference()}

        <View style={[styles.bubbleArea, hasReactions && styles.bubbleAreaWithReactions]}>
          <Pressable
            onLongPress={() => onLongPress(message)}
            onPress={handlePress}
            style={[
              styles.bubble,
              isMe ? styles.bubbleMe : styles.bubblePartner,
              !isNextSameSender && (isMe ? styles.bubbleMeTail : styles.bubblePartnerTail),
              (type === 'image' || type === 'story_reply') && styles.bubbleMedia,
            ]}
          >
            {message.isRecalled?.status ? (
              <Text style={[styles.messageText, styles.recalledText]}>
                Tin nhắn đã được thu hồi
              </Text>
            ) : (
              <>
                {type === 'text' && (
                  <Text style={[styles.messageText, isMe ? styles.textMe : styles.textPartner]}>
                    {content}
                  </Text>
                )}

                {type === 'image' && (
                  <Image
                    source={{ uri: message.mediaUrl || content }}
                    style={styles.fullImage}
                    resizeMode="cover"
                  />
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

                {isMe && (status === 'sending' || status === 'error') && (
                  <View style={styles.statusIconContainer}>
                    {status === 'sending' && (
                      <Icon name="time-outline" size={10} color={colors.iconMuted} />
                    )}
                    {status === 'error' && (
                      <Icon name="alert-circle" size={12} color={colors.error} />
                    )}
                  </View>
                )}
              </>
            )}
          </Pressable>

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

  avatarSlot: {
    width: 32,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  bubbleColumn: {
    flex: 1,
    maxWidth: '75%',
  },
  bubbleColumnLeft: {
    alignItems: 'flex-start',
  },
  bubbleColumnRight: {
    alignItems: 'flex-end',
    marginLeft: 'auto',
    maxWidth: '82%',
  },
  rightSpacer: { width: spacing.xxl },

  bubbleArea: {
    position: 'relative',
    paddingBottom: spacing.sm,
  },
  bubbleAreaWithReactions: {
    paddingBottom: spacing.lg + spacing.xs,
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm_md,
    borderRadius: br.lg + 2,
  },
  bubbleMe: {
    backgroundColor: colors.messengerBlue,
  },
  bubblePartner: {
    backgroundColor: colors.surfaceMedium,
  },
  bubbleMeTail: {
    borderBottomRightRadius: spacing.xs,
  },
  bubblePartnerTail: {
    borderBottomLeftRadius: spacing.xs,
  },
  bubbleMedia: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
    borderRadius: br.lg + 2,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  textMe: { color: colors.white },
  textPartner: { color: colors.textPrimary },
  recalledText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    fontSize: 14,
    opacity: 0.7,
  },

  fullImage: {
    width: 240,
    height: 300,
    borderRadius: br.lg + 2,
  },

  storyReply: {
    width: 230,
  },
  storyRef: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm_md,
    padding: spacing.sm,
    backgroundColor: colors.blurLight,
    borderTopLeftRadius: br.lg + 2,
    borderTopRightRadius: br.lg + 2,
  },
  storyImg: {
    width: 40,
    height: 56,
    borderRadius: br.sm - 3,
  },
  storyTextWrapper: { flex: 1 },
  storyReplyLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 2,
  },
  storyCaption: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  storyContentWrapper: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm_md,
  },

  statusIconContainer: {
    position: 'absolute',
    right: spacing.sm - 2,
    bottom: spacing.xs + 1,
  },

  reactionContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
  },
  reactionLeft: { left: spacing.sm },
  reactionRight: { right: spacing.sm },
  
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfacePill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: br.md,
    borderWidth: 1.5,
    borderColor: colors.borderDark,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  reactionEmojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionIconWrapper: {
    borderRadius: br.sm + 2,
    backgroundColor: colors.surfacePill,
  },
  reactionEmoji: { fontSize: 13 },
  reactionCount: {
    fontSize: 10.5,
    color: colors.textSecondary,
    marginLeft: 3,
    fontWeight: '600',
  },

  replyReference: {
    flexDirection: 'row',
    marginBottom: spacing.xs - 1,
    paddingHorizontal: spacing.sm_md,
    paddingVertical: spacing.sm - 2,
    backgroundColor: colors.blurLight,
    borderRadius: br.md,
    maxWidth: '100%',
    alignSelf: 'stretch',
  },
  replyRefBar: {
    width: 2,
    backgroundColor: colors.messengerBlue,
    marginRight: spacing.sm,
    borderRadius: 1,
  },
  replyRefContent: { flex: 1 },
  replyRefSender: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.messengerBlue,
    marginBottom: 1,
  },
  replyRefText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
