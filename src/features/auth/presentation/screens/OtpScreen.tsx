import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../../core/theme/colors';
import { spacing, sizes } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useSendOtp } from '../../application/hooks/useSendOtp';
import { useVerifyOtp } from '../../application/hooks/useVerifyOtp';
import { useToast } from '../../../../shared/hooks/useToast';
import { useLoading } from '../../../../shared/hooks/useLoading';

import { AuthService } from '../../../../infrastructure/services/auth.service';
import { PhoneInput } from '../components/PhoneInput';
import { OtpInputGroup } from '../components/OtpInputGroup';
import { OtpScreenProps } from '../../domain/types/otp.types';
import { RootStackParamList } from '../../../../navigation/types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * OtpScreen — orchestrates PHONE → OTP.
 * Password/Login is delegated to CreatePasswordScreen securely.
 */
export const OtpScreen: React.FC<OtpScreenProps> = ({ onLoginSuccess }) => {
  const navigation = useNavigation<NavProp>();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);

  const { sendOtp, loading: sendLoading, error: sendError, confirmationRef } = useSendOtp();
  const { verifyOtp, loading: verifyLoading, error: verifyError } = useVerifyOtp();

  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const [checkLoading, setCheckLoading] = useState(false);

  const loading = sendLoading || verifyLoading || checkLoading;
  const errorMsg = sendError || verifyError;

  // Trigger full-screen Loading overlay
  React.useEffect(() => {
    if (loading) {
      showLoading('Vui lòng đợi...');
    } else {
      hideLoading();
    }
  }, [loading, showLoading, hideLoading]);

  // Trigger global toast on error
  React.useEffect(() => {
    if (errorMsg) {
      showToast(errorMsg, 'error');
    }
  }, [errorMsg, showToast]);

  React.useEffect(() => {
    let interval: any = null;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [step, timer]);

  const handleKeyPress = (key: string) => {
    if (loading) return;
    if (key === 'delete') {
      if (step === 'PHONE') setPhoneNumber((prev) => prev.slice(0, -1));
      else if (step === 'OTP') setOtp((prev) => prev.slice(0, -1));
    } else {
      if (step === 'PHONE' && phoneNumber.length < 10) setPhoneNumber((prev) => prev + key);
      else if (step === 'OTP' && otp.length < 6) setOtp((prev) => prev + key);
    }
  };

  const handleContinue = async () => {
    if (step === 'PHONE') {
      setCheckLoading(true);
      try {
        const checkRes = await AuthService.checkPhone(phoneNumber);
        if (checkRes.exists && checkRes.hasPassword) {
          // It is a Login! Save local flag then navigate to CreatePassword-acting Login!
          const { saveUser } = require('../../../../infrastructure/storage/AsyncStorage');
          await saveUser({ phone: phoneNumber, hasPassword: true });
          navigation.navigate('CreatePassword');
          setCheckLoading(false);
          return;
        }
      } catch (err: any) {
        showToast(err.message || 'Lỗi kiểm tra số điện thoại', 'error');
        setCheckLoading(false);
        return;
      }

      // If user doesn't exist or hasn't set password, send OTP
      const sent = await sendOtp(phoneNumber);
      setCheckLoading(false);
      if (sent) {
        setTimer(30);
        setStep('OTP');
      }
    } else if (step === 'OTP') {
      if (!confirmationRef.current) return;
      const result = await verifyOtp(confirmationRef.current, otp);
      if (result) {
        const { saveUser } = require('../../../../infrastructure/storage/AsyncStorage');
        if (result.isNewUser || !result.hasPassword) {
          await saveUser({ phone: phoneNumber, hasPassword: false });
          navigation.navigate('CreatePassword');
        } else if (!result.isProfileComplete) {
          navigation.navigate('ProfileSetup');
        } else {
          if (onLoginSuccess) onLoginSuccess();
        }
      }
    }
  };

  const isDisabled = loading || (step === 'PHONE' ? phoneNumber.length < 9 : otp.length < 6);

  const resendOtp = async () => {
    const sent = await sendOtp(phoneNumber);
    if (sent) setTimer(30);
  };

  const renderContent = () => {
    switch (step) {
      case 'PHONE':
        return (
          <View style={styles.inputWrapper}>
            <Text style={styles.title}>Số của bạn là gì?</Text>
            <Text style={styles.subtitle}>Nhập số điện thoại của bạn để tiếp tục.</Text>
            <PhoneInput value={phoneNumber} onChangeText={setPhoneNumber} editable={true} />
          </View>
        );
      case 'OTP':
        return (
          <View style={styles.inputWrapper}>
            <Text style={styles.title}>Nhập mã xác thực</Text>
            <Text style={styles.subtitle}>{`Mã 6 số đã được gửi tới +84 ${phoneNumber}`}</Text>
            <OtpInputGroup otp={otp} setOtp={setOtp} length={6} />
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
          onPress={() => { if (step === 'OTP') setStep('PHONE'); else navigation.goBack(); }}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={sizes.iconBack} color={colors.neonCyan || colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleContinue} 
          disabled={isDisabled} 
          style={styles.headerNext}
        >
          <Text style={[styles.nextText, isDisabled && styles.nextTextDisabled]}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  errorText: { color: '#FF4D4D', textAlign: 'center', marginTop: spacing.sm, fontSize: typography.sizes.sm },
  header: { 
    paddingHorizontal: spacing.md, 
    paddingTop: spacing.sm, 
    height: 50, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },
  headerNext: { paddingHorizontal: spacing.sm, paddingVertical: 8 },
  nextText: { color: colors.neonCyan || '#00F0FF', fontSize: 16, fontWeight: typography.weights.bold },
  nextTextDisabled: { color: colors.textSecondary, opacity: 0.5 },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  inputWrapper: { width: '100%' },
  title: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.sizes.lg, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 24 },
  phoneInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  phoneInput: { flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.md, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', height: 60 },
  phoneText: { color: colors.textPrimary, fontSize: 22, letterSpacing: 1, fontWeight: typography.weights.semiBold },
  placeholderText: { color: colors.textMuted, fontSize: 18, letterSpacing: 0, fontWeight: typography.weights.regular },
  resendWrapper: { alignItems: 'center', marginTop: spacing.md },
  resendText: { color: colors.textMuted, fontSize: 14 },
  resendLink: { color: colors.neonCyan || '#00F0FF', fontWeight: typography.weights.semiBold },
  resendLinkMuted: { color: colors.textSecondary, opacity: 0.6 },
  bottomSection: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, position: 'relative' },
  continueButtonWrapper: { position: 'absolute', right: spacing.lg, top: -30, width: 64, height: 64, borderRadius: 32, zIndex: 10 },
  continueButton: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', shadowColor: colors.neonPink || '#FF0099', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 10, elevation: 5 },
});