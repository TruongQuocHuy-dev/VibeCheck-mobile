import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import { spacing, sizes } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useNavigation } from '@react-navigation/native';
import { useOtpForm } from '../../hooks/auth/useOtpForm';
import { Keypad } from '../../components/molecules/Keypad';
import { PhoneInput } from '../../components/molecules/PhoneInput';
import { OtpInputGroup } from '../../components/molecules/OtpInputGroup';
import { OtpScreenProps } from '../../types/presentation/auth/otp.types';

/**
 * Screen atom responsible only for rendering relative authentication forms views.
 */
export const OtpScreen: React.FC<OtpScreenProps> = ({ onLoginSuccess }) => {

  const navigation = useNavigation();
  const { step, phoneNumber, otp, password, timer, setStep, handleKeyPress, handleContinue, resendOtp } = useOtpForm(onLoginSuccess);

  const renderContent = () => {
    switch (step) {
      case 'PHONE':
        return (
          <View style={styles.inputWrapper}>
            <Text style={styles.title}>Số của bạn là gì?</Text>
            <Text style={styles.subtitle}>Nhập số điện thoại của bạn để tiếp tục.</Text>
            <PhoneInput 
              value={phoneNumber} 
              onChangeText={() => {}} 
              editable={false} 
              testID="auth-otp-phone-input" 
            />
          </View>
        );
      case 'PASSWORD':
        return (
          <View style={styles.inputWrapper}>
            <Text style={styles.title}>Chào đơn bạn trở lại</Text>
            <Text style={styles.subtitle}>Nhập mật khẩu của bạn để đăng nhập.</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.phoneInput}>
                <Text style={[styles.phoneText, !password && styles.placeholderText]}>
                  {password ? '•'.repeat(password.length) : 'Nhập mật khẩu'}
                </Text>
              </View>
            </View>
          </View>
        );
      case 'OTP':
        return (
          <View style={styles.inputWrapper}>
            <Text style={styles.title}>Nhập mã xác thực</Text>
            <Text style={styles.subtitle}>{`Mã 4 số đã được gửi tới +84 ${phoneNumber}`}</Text>
            
            <OtpInputGroup otp={otp} />

            <TouchableOpacity disabled={timer > 0} onPress={resendOtp} style={styles.resendWrapper}>
              <Text style={styles.resendText}>
                Mã OTP đã được gửi. {timer > 0 ? (
                  <Text style={styles.resendLinkMuted}>{`Gửi lại (${timer}s)`}</Text>
                ) : (
                  <Text style={styles.resendLink}>Gửi lại ngay</Text>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (step === 'OTP' || step === 'PASSWORD') setStep('PHONE');
            else navigation.goBack();
          }} 
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          testID="auth-otp-back-button"
        >
          <Icon name="chevron-back" size={sizes.iconBack} color={colors.neonCyan || colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.continueButtonWrapper}
          activeOpacity={0.8}
          onPress={handleContinue}
          disabled={
            step === 'PHONE' ? phoneNumber.length < 9 :
            step === 'OTP' ? otp.length < 4 : (password?.length ?? 0) < 4
          }
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục"
          testID="auth-otp-continue-button"
        >
          <LinearGradient
            colors={
              ((step === 'PHONE' && phoneNumber.length >= 9) ||
               (step === 'OTP' && otp.length === 4) ||
               (step === 'PASSWORD' && (password?.length ?? 0) >= 4))
                ? [colors.neonPink || colors.primaryPink, colors.primaryPurple]

                : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Icon name="arrow-forward" size={24} color={colors.textPrimary} />
          </LinearGradient>
        </TouchableOpacity>

        <Keypad onKeyPress={handleKeyPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    height: 50,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  inputWrapper: {
    width: '100%',
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  countryCode: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  countryCodeText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: typography.weights.semiBold,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    height: 60,
  },
  phoneText: {
    color: colors.textPrimary,
    fontSize: 22,
    letterSpacing: 1,
    fontWeight: typography.weights.semiBold,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 18,
    letterSpacing: 0,
    fontWeight: typography.weights.regular,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  otpSlot: {
    width: 60,
    height: 70,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpSlotActive: {
    borderColor: colors.neonCyan || colors.primaryPink,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  otpSlotFilled: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  otpText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
  },
  resendWrapper: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resendText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  resendLink: {
    color: colors.neonCyan || '#00F0FF',
    fontWeight: typography.weights.semiBold,
  },
  resendLinkMuted: {
    color: colors.textSecondary,
    opacity: 0.6,
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    position: 'relative',
  },
  continueButtonWrapper: {
    position: 'absolute',
    right: spacing.lg,
    top: -30, // Floats above keypad
    width: 64,
    height: 64,
    borderRadius: 32,
    zIndex: 10,
  },
  continueButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neonPink || '#FF0099',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
});