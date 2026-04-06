import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

interface VibeInteractionModalProps {
  visible: boolean;
  onClose: () => void;
  interactions: any[];
  viewCount: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export const VibeInteractionModal: React.FC<VibeInteractionModalProps> = ({
  visible,
  onClose,
  interactions,
  viewCount,
  isLoading,
  onRefresh,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalDismiss} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        <View style={styles.modalContent}>
          <View style={styles.modalIndicator} />
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{viewCount} người xem</Text>
            </View>
            <View style={styles.modalHeaderRight}>
              <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                <Icon name="refresh-outline" size={spacing.md} color={colors.white} />
                <Text style={styles.refreshText}>Làm mới</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
                <Icon name="close" size={spacing.xl} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {isLoading ? (
            <View style={styles.emptyInteractionsWrap}>
              <ActivityIndicator size="small" color={colors.neonCyan} />
              <Text style={[styles.emptyInteractions, { marginTop: spacing.md }]}>Đang tải tương tác...</Text>
            </View>
          ) : (
            <FlatList
              data={interactions}
              keyExtractor={(item, index) => item.sender?._id || item._id || index.toString()}
              contentContainerStyle={styles.interactionsList}
              renderItem={({ item }) => (
                <View style={styles.interactionItem}>
                  <Image source={{ uri: item.sender?.avatar }} style={styles.viewerAvatar} />
                  <View style={styles.interactionInfo}>
                    <Text style={styles.viewerName}>{item.sender?.displayName || item.sender?.fullName}</Text>
                    {item.latestReply && (
                      <Text style={styles.interactionText} numberOfLines={1}>{item.latestReply}</Text>
                    )}
                    {item.reactions && item.reactions.length > 0 && (
                      <View style={styles.reactionsBadgeRow}>
                        {item.reactions.slice(0, 5).map((emoji: string, i: number) => (
                          <Text key={`emoji-${i}`} style={styles.reactionEmojiText}>{emoji}</Text>
                        ))}
                        {item.reactions.length > 5 && (
                          <Text style={styles.reactionMoreText}>+{item.reactions.length - 5}</Text>
                        )}
                      </View>
                    )}
                  </View>
                  <View style={styles.interactionTimeWrap}>
                    <Text style={styles.interactionTime}>
                      {new Date(item.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyInteractionsWrap}>
                  <Icon name="chatbubble-ellipses-outline" size={spacing.xxl + spacing.lg} color={colors.whiteOpacity20} />
                  <Text style={styles.emptyInteractions}>Chưa có ai tương tác với Vibe này</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.blurDark,
  },
  modalDismiss: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.cardDark,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.sm,
    height: '60%',
    borderWidth: 1,
    borderColor: colors.cyanBorder,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: colors.whiteOpacity20,
    borderRadius: borderRadius.sm,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.overlayBorder,
  },
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.whiteOpacity10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  refreshText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  modalCloseBtn: {
    padding: spacing.xs,
  },
  interactionsList: {
    padding: spacing.xl,
  },
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
    gap: spacing.md,
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
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  interactionText: {
    fontSize: typography.sizes.sm,
    color: colors.textOpacity60,
    marginBottom: 4,
  },
  reactionsBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reactionEmojiText: {
    fontSize: typography.sizes.lg,
  },
  reactionMoreText: {
    fontSize: typography.sizes.sm,
    color: colors.textOpacity60,
    marginLeft: 2,
  },
  interactionTimeWrap: {
    alignItems: 'flex-end',
  },
  interactionTime: {
    fontSize: typography.sizes.xs,
    color: colors.textOpacity60,
  },
  emptyInteractionsWrap: {
    paddingTop: 60,
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyInteractions: {
    fontSize: typography.sizes.sm,
    color: colors.textOpacity60,
    textAlign: 'center',
  },
});
