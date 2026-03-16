import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { AvatarPickerProps } from '../../types/presentation/components/avatar-picker.types';

/**
 * Reusable Molecule component rendering a Circular Avatar frame with Blur layout overlap.
 */
export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  avatarUri,
  onPickAvatar,
  testID,
}) => {
  return (
    <View style={styles.avatarSection}>
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>✨ Ảnh của bạn sẽ được làm mờ cho đến khi Match!</Text>
      </View>

      <View style={styles.avatarWrapper}>
        {avatarUri ? (
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            {/* Absolute blurred segment simulation */}
            <Image 
              source={{ uri: avatarUri }} 
              style={[styles.avatarImage, styles.avatarBlurred]} 
              blurRadius={12} 
            />
            <View style={styles.avatarOverlay} />
          </View>
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="account" size={80} color={colors.borderLight} />
          </View>
        )}
      </View>

      <TouchableOpacity 
        onPress={onPickAvatar} 
        style={styles.uploadButton}
        accessibilityRole="button"
        accessibilityLabel="Tải ảnh lên"
        testID={testID}
      >
        <Icon name="camera-plus-outline" size={18} color={colors.neonCyan} />
        <Text style={styles.uploadText}>Tải ảnh lên</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  tooltip: {
    backgroundColor: colors.bgTooltip,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  tooltipText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  avatarWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.borderLight,
    backgroundColor: colors.cardDark,
    marginBottom: spacing.md,
  },
  avatarContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  avatarBlurred: {
    height: '50%',
    bottom: 0,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    opacity: 0.9,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgTooltip,
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cyanBg,
  },
  uploadText: {
    fontSize: 13,
    color: colors.neonCyan,
    fontWeight: typography.weights.bold,
  },
});
