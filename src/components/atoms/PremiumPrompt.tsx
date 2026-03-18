import React, { memo } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../core/theme/colors';
import { borderRadius, spacing } from '../../core/theme/spacing';
import { typography } from '../../core/theme/typography';

type PremiumButtonVariant = 'gradient' | 'solid';

interface PremiumPromptProps {
  buttonLabel: string;
  onPress: () => void;
  message?: string;
  showLockIcon?: boolean;
  buttonVariant?: PremiumButtonVariant;
  style?: StyleProp<ViewStyle>;
}

export const PremiumPrompt: React.FC<PremiumPromptProps> = memo(
  ({
    buttonLabel,
    onPress,
    message,
    showLockIcon = true,
    buttonVariant = 'solid',
    style,
  }) => {
    const isGradient = buttonVariant === 'gradient';

    return (
      <View style={[styles.container, style]}>
        {showLockIcon && <Icon name="lock-closed" size={spacing.xl} color={colors.neonCyan} />}

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity style={styles.buttonWrap} onPress={onPress} activeOpacity={0.9}>
          {isGradient ? (
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonBase}
            >
              <Text style={styles.buttonTextPrimary}>{buttonLabel}</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.buttonBase, styles.buttonSolid]}>
              <Text style={styles.buttonTextDark}>{buttonLabel}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  message: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semiBold,
    textAlign: 'center',
  },
  buttonWrap: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    minWidth: spacing.xxl + spacing.xxl + spacing.lg,
  },
  buttonBase: {
    minHeight: spacing.xl + spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  buttonSolid: {
    backgroundColor: colors.neonCyan,
  },
  buttonTextPrimary: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  buttonTextDark: {
    color: colors.bgDark,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
});

PremiumPrompt.displayName = 'PremiumPrompt';
