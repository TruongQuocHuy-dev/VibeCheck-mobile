import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../core/theme/colors';
import { spacing } from '../../core/theme/spacing';
import { typography } from '../../core/theme/typography';
import { BorderInputProps } from '../../types/border-input.types';

/**
 * Reusable Atom component rendering a Styled Input with Left Icon container view.
 */
export const BorderInput: React.FC<BorderInputProps> = ({
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry = false,
  keyboardType = 'default',
  maxLength,
  style,
  inputStyle,
  iconColor = colors.iconMuted,
  testID,
  editable = true,
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={[styles.gradientWrapper, style]}>
      <View style={styles.inputInner}>
        {iconName && (
          <Icon name={iconName} size={22} color={iconColor} style={styles.inputIcon} />
        )}
        <TextInput
          style={[styles.textInput, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={secureTextEntry && !isSecure ? 'visible-password' : keyboardType}
          autoCorrect={false}
          maxLength={maxLength}
          autoCapitalize="none"
          testID={testID}
          editable={editable}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} style={{ padding: spacing.xs }}>
            <Icon
              name={isSecure ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.iconMuted}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: 12,
    padding: 1,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: 11,
    paddingHorizontal: spacing.md,
    height: 54,
  },

  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: typography.weights.medium,
  },
});
