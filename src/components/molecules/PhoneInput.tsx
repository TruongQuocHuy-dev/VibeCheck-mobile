import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BorderInput } from '../atoms/BorderInput';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { PhoneInputProps } from '../../types/presentation/components/phone-input.types';


/**
 * Reusable Molecule component combining Country Code Prefix and BorderInput.
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Nhập số điện thoại',
  testID,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Country Code Prefix */}
      <View style={styles.countryCode}>
        <Text style={styles.countryCodeText}>+84</Text>
      </View>

      {/* Actual Input */}
      <BorderInput
        style={styles.inputWrapper}
        inputStyle={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType="number-pad"
        maxLength={11}
        testID={testID}
        editable={editable}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  countryCode: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.blurLight,
    borderRadius: 12,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    height: 56,
    justifyContent: 'center',
  },

  countryCodeText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: typography.weights.semiBold,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    fontSize: 20,
    letterSpacing: 1,
    fontWeight: typography.weights.semiBold,
  },
});
