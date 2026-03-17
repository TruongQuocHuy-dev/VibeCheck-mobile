import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../../constants/colors';
import { spacing, sizes } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { useNavigation } from '@react-navigation/native';

import { useSendOtp } from '../../application/hooks/useSendOtp';
import { useVerifyOtp } from '../../application/hooks/useVerifyOtp';
import { useLoginPassword } from '../../application/hooks/useLoginPassword';

import { Keypad } from '../components/Keypad';
import { PhoneInput } from '../components/PhoneInput';
import { OtpInputGroup } from '../components/OtpInputGroup';
import { OtpScreenProps } from '../../domain/types/otp.types';

/**
 * Screen presentation handling UI states via atomic hooks flow orchestrations.
 */
export const OtpScreen: React.FC<OtpScreenProps> = ({ onLoginSuccess }) => {
  const navigation = useNavigation();
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PASSWORD'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [timer, setTimer] = useState(30);

  const { sendOtp, loading: loadingSend, error: errorSend } = useSendOtp();
  const { verifyOtp, loading: loadingVerify, error: errorVerify } = useVerifyOtp(onLoginSuccess ?? (() => {}));
  const { login, loading: loadingLogin, error: errorLogin } = useLoginPassword(onLoginSuccess ?? (() => {}));

  useEffect(() => {
    let interval: any = null;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [step, timer]);

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      if (step === 'PHONE') setPhoneNumber((prev) => prev.slice(0, -1));
      else if (step === 'OTP') setOtp((prev) => prev.slice(0, -1));
      else if (step === 'PASSWORD') setPassword((prev) => prev.slice(0, -1));
    } else {
      if (step === 'PHONE' && phoneNumber.length < 10) setPhoneNumber((prev) => prev + key);
      else if (step === 'OTP' && otp.length < 4) setOtp((prev) => prev + key);
      else if (step === 'PASSWORD' && password.length < 6) setPassword((prev) => prev + key);
    }
  };

  const handleContinue = async () => {
    if (step === 'PHONE') {
      const nextStep = await sendOtp(phoneNumber, () => setStep('OTP'));
      if (nextStep === 'PASSWORD') setStep('PASSWORD');
    } else if (step === 'OTP') {
      await verifyOtp(phoneNumber, otp);
    } else if (step === 'PASSWORD') {
      await login(phoneNumber, password);
    }
  };

  const resendOtp = async () => {
    setTimer(30);
    await sendOtp(phoneNumber, () => {});
  };

  const loading = loadingSend || loadingVerify || loadingLogin;
  const errorMsg = errorSend || errorVerify || errorLogin;

  const renderContent = () => {
    switch (step) {
      case 'PHONE':
        return (
          <View style={styles.inputWrapper}>
            <Text style={styles.title}>Số của bạn là gì?</Text>
            <Text style={styles.subtitle}>Nhập số điện thoại của bạn để tiếp tục.</Text>
            <PhoneInput value={phoneNumber} onChangeText={() => {}} editable={false} />
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
            <TouchableOpacity disabled={timer > 0 || loading} onPress={resendOtp} style={styles.resendWrapper}>
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
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => { if (step === 'OTP' || step === 'PASSWORD') setStep('PHONE'); else navigation.goBack(); }} 
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={sizes.iconBack} color={colors.neonCyan || colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderContent()}
        {errorMsg && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorMsg}</Text>}
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.continueButtonWrapper}
          activeOpacity={0.8}
          onPress={handleContinue}
          disabled={loading || (step === 'PHONE' ? phoneNumber.length < 9 : step === 'OTP' ? otp.length < 4 : password.length < 4)}
        >
          <LinearGradient
            colors={
              ((step === 'PHONE' && phoneNumber.length >= 9) || (step === 'OTP' && otp.length === 4) || (step === 'PASSWORD' && password.length >= 4))
                ? [colors.neonPink || colors.primaryPink, colors.primaryPurple]
                : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']
            }
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Icon name={loading ? "sync" : "arrow-forward"} size={24} color={colors.textPrimary} />
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