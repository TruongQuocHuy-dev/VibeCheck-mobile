import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../constants/colors';
import { spacing } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { OtpInputGroupProps } from '../../domain/types/otp-input.types';


/**
 * Reusable Molecule component rendering a Row of OTP slots highlighted.
 */
export const OtpInputGroup: React.FC<OtpInputGroupProps> = ({
  otp,
  length = 4,
}) => {
  return (
    <View style={styles.otpContainer}>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  otpSlot: {
    width: 60,
    height: 70,
    borderRadius: 16,
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
