import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { GradientButtonProps } from '../../types/gradient-button.types';




/**
 * Reusable Atom component rendering a linear gradient neon button view.
 */
export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  disabled = false,
  leftIcon,
  rightIcon,
  gradientColors = [colors.primaryPink, colors.primaryPurple],
  style,
  textStyle,
  iconSize = 20,
  testID,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      style={[styles.wrapper, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
    >
      <LinearGradient
        colors={disabled ? ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)'] : gradientColors}

        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        {leftIcon && (
          <Icon name={leftIcon} size={iconSize} color={colors.white} style={styles.leftIcon} />
        )}
        <Text style={[styles.text, textStyle, disabled && styles.disabledText]}>{title}</Text>
        {rightIcon && (
          <Icon name={rightIcon} size={iconSize} color={colors.white} style={styles.rightIcon} />
        )}

      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 9999,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  button: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: typography.weights.bold,
  },

  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  disabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: 'rgba(255,255,255,0.3)',
  },
});
