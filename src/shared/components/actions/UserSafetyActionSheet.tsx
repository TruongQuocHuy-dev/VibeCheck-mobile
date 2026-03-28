import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { colors } from '../../../core/theme/colors';
import { spacing } from '../../../core/theme/spacing';
import { typography } from '../../../core/theme';

interface UserSafetyActionSheetProps {
  visible: boolean;
  userName?: string;
  onClose: () => void;
  onBlock?: () => void;
  onReport?: () => void;
}

export const UserSafetyActionSheet: React.FC<UserSafetyActionSheetProps> = ({
  visible,
  userName,
  onClose,
  onBlock,
  onReport,
}) => {
  const displayName = userName || 'nguoi dung nay';

  const handleBlock = React.useCallback(() => {
    onBlock?.();
    onClose();
  }, [onBlock, onClose]);

  const handleReport = React.useCallback(() => {
    onReport?.();
    onClose();
  }, [onReport, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <SafeAreaView edges={['bottom']}>
            <View style={styles.handle} />

            <Text style={styles.title}>An toan va hanh dong</Text>
            <Text style={styles.subtitle}>Quan ly tuong tac voi {displayName}</Text>

            <TouchableOpacity style={styles.actionRow} onPress={handleReport}>
              <Icon name="flag-outline" size={20} color={colors.warning} />
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>Bao cao</Text>
                <Text style={styles.actionHint}>Bao cao noi dung khong phu hop hoac lua dao.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionRow} onPress={handleBlock}>
              <Icon name="ban-outline" size={20} color={colors.error} />
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>Chan</Text>
                <Text style={styles.actionHint}>Chan de khong con thay ho trong Discovery.</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Nguyen tac va bi quyet giu an toan</Text>
              <Text style={styles.infoLine}>• Khong chia se ma OTP, mat khau, tai khoan ngan hang.</Text>
              <Text style={styles.infoLine}>• Gap nhau o noi cong cong va bao cho ban be biet lich hen.</Text>
              <Text style={styles.infoLine}>• Neu thay dau hieu bat thuong, hay chan va bao cao ngay.</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Dong</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: colors.overlayBorder,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    alignSelf: 'center',
    backgroundColor: colors.overlayBorder,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: spacing.md,
    color: colors.textOpacity60,
    fontSize: typography.sizes.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.overlayLight,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  actionTextWrap: {
    flex: 1,
  },
  actionTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: typography.sizes.md,
  },
  actionHint: {
    marginTop: 2,
    color: colors.textOpacity80,
    fontSize: typography.sizes.sm,
  },
  infoCard: {
    marginTop: spacing.sm,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    backgroundColor: colors.cyanBg,
    gap: 4,
  },
  infoTitle: {
    color: colors.neonCyan,
    fontWeight: '700',
    fontSize: typography.sizes.sm,
    marginBottom: 2,
  },
  infoLine: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  closeBtn: {
    marginTop: spacing.md,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.overlayLight,
  },
  closeText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: typography.sizes.md,
  },
});
