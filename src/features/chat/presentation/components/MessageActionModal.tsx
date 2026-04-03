import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { REACTION_EMOJIS } from '../../data/chat.data';

interface MessageActionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  onActionPress: (action: 'reply' | 'copy' | 'report' | 'delete' | 'recall' | 'save') => void;
  isMyMessage?: boolean;
  isRecalled?: boolean;
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'story_reply';
}

export const MessageActionModal: React.FC<MessageActionModalProps> = ({
  visible,
  onClose,
  onSelectEmoji,
  onActionPress,
  isMyMessage,
  isRecalled,
  messageType,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Emoji Banner - Hide if recalled */}
              {!isRecalled && (
                <View style={styles.reactionBanner}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.emojiList}
                  >
                    {REACTION_EMOJIS.map((emoji: string) => (
                      <TouchableOpacity
                        key={emoji}
                        onPress={() => {
                          onClose();
                          onSelectEmoji(emoji);
                        }}
                        style={styles.emojiItem}
                      >
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Action Menu */}
              <View style={styles.actionMenu}>
                {!isRecalled && (
                  <>
                    <TouchableOpacity
                      style={styles.actionItem}
                      onPress={() => {
                        onClose();
                        onActionPress('reply');
                      }}
                    >
                      <Text style={styles.actionText}>Trả lời</Text>
                      <Icon name="arrow-undo-outline" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>

                    {(messageType === 'text' || messageType === 'story_reply') && (
                      <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => {
                          onClose();
                          onActionPress('copy');
                        }}
                      >
                        <Text style={styles.actionText}>Sao chép</Text>
                        <Icon name="copy-outline" size={20} color={colors.textPrimary} />
                      </TouchableOpacity>
                    )}

                    {isMyMessage && (
                      <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => {
                          onClose();
                          onActionPress('recall');
                        }}
                      >
                        <Text style={styles.actionText}>Thu hồi</Text>
                        <Icon name="refresh-outline" size={20} color={colors.textPrimary} />
                      </TouchableOpacity>
                    )}
                    {messageType === 'image' && (
                      <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => {
                          onClose();
                          onActionPress('save');
                        }}
                      >
                        <Text style={styles.actionText}>Lưu ảnh</Text>
                        <Icon name="download-outline" size={20} color={colors.textPrimary} />
                      </TouchableOpacity>
                    )}
                  </>
                )}

                <TouchableOpacity
                  style={[styles.actionItem, isRecalled && styles.lastItem]}
                  onPress={() => {
                    onClose();
                    onActionPress('delete');
                  }}
                >
                  <Text style={styles.actionText}>Xóa ở phía tôi</Text>
                  <Icon name="trash-outline" size={20} color={colors.textPrimary} />
                </TouchableOpacity>

                {!isRecalled && (
                  <TouchableOpacity
                    style={[styles.actionItem, styles.lastItem]}
                    onPress={() => {
                      onClose();
                      onActionPress('report');
                    }}
                  >
                    <Text style={[styles.actionText, styles.reportText]}>Báo cáo</Text>
                    <Icon name="flag-outline" size={20} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayStrong,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  reactionBanner: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceHigh,
    borderRadius: borderRadius.radius_pill,
    paddingHorizontal: spacing.sm_md,
    paddingVertical: spacing.xs + 2,
    marginBottom: spacing.md,
    maxWidth: '90%',
    height: spacing.xxl + spacing.sm + spacing.md, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  emojiList: {
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  emojiItem: {
    padding: spacing.sm,
    marginHorizontal: 1,
  },
  emojiText: {
    fontSize: 26,
  },
  actionMenu: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: borderRadius.radius_modal,
    width: '75%',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surfacePill,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  reportText: {
    color: colors.error,
  }
});
