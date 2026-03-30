import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

interface VibeReactionsBarProps {
  quickReactions: any[];
  selectedReaction: string | null;
  replyInput: string;
  setReplyInput: (text: string) => void;
  handleReactionPress: (id: string) => void;
  handleSendReply: () => void;
}

export const VibeReactionsBar: React.FC<VibeReactionsBarProps> = ({
  quickReactions,
  selectedReaction,
  replyInput,
  setReplyInput,
  handleReactionPress,
  handleSendReply,
}) => {
  return (
    <>
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
            placeholder="Trả lời Vibe..."
            placeholderTextColor={colors.textOpacity60}
          />
          <Icon name="camera-outline" size={spacing.md} color={colors.textOpacity80} />
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleSendReply} activeOpacity={0.9}>
          <Icon name="send" size={spacing.md_sm} color={colors.bgDark} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
