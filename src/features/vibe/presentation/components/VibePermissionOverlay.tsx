import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

interface VibePermissionOverlayProps {
  onRequestPermission: () => void;
  onClose: () => void;
}

export const VibePermissionOverlay: React.FC<VibePermissionOverlayProps> = ({
  onRequestPermission,
  onClose,
}) => {
  return (
    <View style={styles.permScreen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Icon name="camera-off" size={64} color={colors.textMuted} />
      <Text style={styles.permTitle}>Cần quyền Camera</Text>
      <Text style={styles.permSub}>VibeCheck cần truy cập camera để chụp Vibe của bạn.</Text>
      <TouchableOpacity style={styles.permBtn} onPress={onRequestPermission}>
        <Text style={styles.permBtnTxt}>Cấp quyền</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.permCancel} onPress={onClose}>
        <Text style={styles.permCancelTxt}>Để sau</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  permScreen: {
    flex: 1,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  permTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  permSub: {
    color: colors.textSecondary,
    fontSize: typography.sizes.lg,
    textAlign: 'center',
  },
  permBtn: {
    backgroundColor: colors.vibeCyan,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm_md,
    marginTop: spacing.md,
  },
  permBtnTxt: {
    color: colors.bgDark,
    fontWeight: typography.weights.bold,
    fontSize: typography.sizes.lg,
  },
  permCancel: {
    marginTop: spacing.sm,
  },
  permCancelTxt: {
    color: colors.textMuted,
    fontSize: typography.sizes.lg,
  },
});
