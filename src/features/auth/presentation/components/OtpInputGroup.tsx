import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { OtpInputGroupProps } from '../../domain/types/otp-input.types';


import { TextInput } from 'react-native';

/**
 * Reusable Molecule component rendering a Row of OTP slots highlighted.
 */
export const OtpInputGroup: React.FC<OtpInputGroupProps> = ({
  otp,
  setOtp,
  length = 4,
}) => {
  return (
    <View style={styles.otpContainer}>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        maxLength={length}
        keyboardType="number-pad"
        style={styles.hiddenInput}
        caretHidden={true}
        autoFocus={true} // Automatically pop up native keyboard
      />
      {Array.from({ length }).map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.otpSlot, 
            otp.length === index && styles.otpSlotActive,
            otp.length > index && styles.otpSlotFilled
          ]}
        >
          <Text style={styles.otpText}>
            {otp[index] || ''}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    zIndex: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  otpSlot: {
    width: 48,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.blurLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  otpSlotActive: {
    borderColor: colors.neonCyan,
    borderWidth: 2,
    backgroundColor: colors.blurLight,
  },
  otpSlotFilled: {
    borderColor: colors.placeholder,
  },
  otpText: {

    color: colors.textPrimary,
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
  },
});
