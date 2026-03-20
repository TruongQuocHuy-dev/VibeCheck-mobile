import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../../../../core/theme/colors';
import { spacing, sizes } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { RootStackParamList } from '../../../../navigation/types';
import { AuthApiService } from '../../../../infrastructure/services/auth.api.service';
import { useLoading } from '../../../../shared/hooks/useLoading';
import { useToast } from '../../../../shared/hooks/useToast';
import { getUser, saveUser } from '../../../../infrastructure/storage/AsyncStorage';
import { BorderInput } from '../../../../components/atoms/BorderInput';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * CreatePasswordScreen — new users set their password after Firebase OTP verification.
 * Navigates to ProfileSetup on success.
 */
export const CreatePasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const checkState = async () => {
      const user: any = await getUser();
      if (user?.hasPassword) {
        setIsLogin(true);
        setPhone(user.phone || '');
      }
    };
    checkState();
  }, []);

  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  // Trigger full-screen Loading overlay
  React.useEffect(() => {
    if (loading) {
      showLoading('Xin đợi...');
    } else {
      hideLoading();
    }
  }, [loading, showLoading, hideLoading]);

  React.useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

  const MIN_LENGTH = 6;
  const isReady = password.length >= MIN_LENGTH;

  const handleAction = async () => {
    if (!isReady) return;
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        // Authenticate as Back door Login
        const res = await AuthApiService.login(phone, password);

        // Save tokens and user info to satisfy next boot hydration!
        const { saveTokens, saveUser } = require('../../../../infrastructure/storage/AsyncStorage');
        await saveTokens(res.accessToken, res.refreshToken);
        await saveUser({
          phone,
          hasPassword: true,
          isProfileComplete: res.isProfileComplete,
        });

        if (res.isProfileComplete) {
          // Absolute Main screen gates, but Nav setup does it
          const { DeviceEventEmitter } = require('react-native');
          DeviceEventEmitter.emit('login_success_reauth'); // Force hydrate again!
        } else {
          navigation.navigate('ProfileSetup');
        }
      } else {
        await AuthApiService.setPassword(password);

        // Update local hydration flag
        const user: any = await getUser();
        if (user) {
          await saveUser({ ...user, hasPassword: true });
        }

        navigation.navigate('ProfileSetup');
      }
    } catch (err: any) {
      setError(err.message || 'Không thể xác thực. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color={colors.neonCyan || colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAction}
          disabled={!isReady || loading}
          style={styles.headerNext}
        >
          <Text style={[styles.nextText, (!isReady || loading) && styles.nextTextDisabled]}>{isLogin ? 'Đăng nhập' : 'Tiếp theo'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{isLogin ? 'Đăng nhập' : 'Tạo mật khẩu'}</Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Nhập mật khẩu của bạn để tiếp tục.'
            : `Đặt mật khẩu để đăng nhập lần sau\n(ít nhất ${MIN_LENGTH} ký tự).`}
        </Text>

        <BorderInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Nhập mật khẩu"
          editable={true}
        />

        <View style={styles.strengthBar}>
          <View style={[styles.strength, { width: `${Math.min((password.length / 12) * 100, 100)}%`, backgroundColor: password.length >= MIN_LENGTH ? colors.neonCyan || '#00F0FF' : colors.primaryPink || '#FF0099' }]} />
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
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
  title: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.sizes.lg, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 24 },
  strengthBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: spacing.sm, marginTop: spacing.md },
  strength: { height: '100%', borderRadius: 2 },
  errorText: { color: '#FF4D4D', textAlign: 'center', marginTop: spacing.sm, fontSize: typography.sizes.sm },
});
