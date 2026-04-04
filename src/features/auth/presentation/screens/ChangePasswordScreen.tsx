import React, { useState, useEffect, useContext } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Icon from 'react-native-vector-icons/Ionicons';

import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { useChangePassword } from '../../application/hooks/useChangePassword';
import { useToast } from '../../../../shared/hooks/useToast';
import { useLoading } from '../../../../shared/hooks/useLoading';
import { NetworkContext } from '../../../../shared/providers/NetworkProvider';
import { EmptyState } from '../../../../shared/components/feedback/Empty';
import { ErrorBoundary } from '../../../../shared/components/feedback/Error';
import { LoadingOverlay } from '../../../../shared/components/feedback/Loading';

export const ChangePasswordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const network = useContext(NetworkContext);
  
  const {
    hasPassword,
    formData,
    isLoading,
    error,
    isSuccess,
    passwordStatus,
    handleInputChange,
    handleSubmit,
    handleBack,
  } = useChangePassword();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync loading state with global overlay
  useEffect(() => {
    if (isLoading) {
      showLoading('Đang xử lý...');
    } else {
      hideLoading();
    }
    return () => hideLoading();
  }, [isLoading, showLoading, hideLoading]);

  // Sync errors with Toast
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

  // Sync success with Toast
  useEffect(() => {
    if (isSuccess) {
      showToast(
        hasPassword ? 'Mật khẩu đã được thay đổi!' : 'Thiết lập mật khẩu thành công!', 
        'success'
      );
      handleBack();
    }
  }, [isSuccess, hasPassword, showToast, handleBack]);

  const onFormSubmit = () => {
    if (network && !network.isOnline) {
      showToast('Không có kết nối mạng. Vui lòng kiểm tra lại.', 'error');
      return;
    }
    handleSubmit();
  };

  if (hasPassword === null) {
    return (
      <View style={styles.container}>
        <LoadingOverlay visible={true} message="Đang tải dữ liệu..." />
      </View>
    );
  }

  const screenTitle = hasPassword ? 'Đổi mật khẩu' : 'Thiết lập mật khẩu';
  const submitText = hasPassword ? 'CẬP NHẬT MẬT KHẨU' : 'THIẾT LẬP MẬT KHẨU';

  const renderStatusItem = (met: boolean, text: string) => (
    <View style={styles.statusItem}>
      <Icon 
        name={met ? "checkmark-circle" : "radio-button-off"} 
        size={16} 
        color={met ? colors.success : colors.textSecondary} 
        style={styles.statusIcon}
      />
      <Text style={[styles.statusText, met && styles.statusTextActive]}>{text}</Text>
    </View>
  );

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <Icon name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{screenTitle}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: spacing.xxl + insets.bottom }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bottomOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <View style={styles.infoBox}>
            <Icon name={hasPassword ? "shield-checkmark-outline" : "lock-open-outline"} size={40} color={colors.primary} />
            <Text style={styles.infoText}>
              {hasPassword 
                ? 'Để thay đổi mật khẩu, vui lòng nhập mật khẩu hiện tại và mật khẩu mới cực mạnh.'
                : 'Hãy thiết lập mật khẩu có tính bảo mật cao để bảo vệ tài khoản của bạn.'}
            </Text>
          </View>

          <View style={styles.form}>
            {hasPassword && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mật khẩu hiện tại</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="lock-open-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu cũ"
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry={!showOldPassword}
                    value={formData.oldPassword}
                    onChangeText={(text) => handleInputChange('oldPassword', text)}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowOldPassword(!showOldPassword)}
                    activeOpacity={0.6}
                  >
                    <Icon 
                      name={showOldPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color={colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu mới</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!showNewPassword}
                  value={formData.newPassword}
                  onChangeText={(text) => handleInputChange('newPassword', text)}
                />
                <TouchableOpacity 
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  activeOpacity={0.6}
                >
                  <Icon 
                    name={showNewPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Real-time status checklist */}
              <View style={styles.statusGrid}>
                <View style={styles.statusColumn}>
                  {renderStatusItem(passwordStatus.length, 'Tối thiểu 8 ký tự')}
                  {renderStatusItem(passwordStatus.uppercase, 'Ít nhất 1 chữ hoa')}
                  {renderStatusItem(passwordStatus.lowercase, 'Ít nhất 1 chữ thường')}
                </View>
                <View style={styles.statusColumn}>
                  {renderStatusItem(passwordStatus.number, 'Ít nhất 1 số')}
                  {renderStatusItem(passwordStatus.special, 'Ký tự đặc biệt (!@#...)')}
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
              <View style={styles.inputWrapper}>
                <Icon name="checkmark-circle-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập lại mật khẩu mới"
                  placeholderTextColor={colors.placeholder}
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.6}
                >
                  <Icon 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton]}
              onPress={onFormSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>{submitText}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgTooltip,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  infoBox: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: colors.bgTooltip,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    height: 56,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    height: '100%',
  },
  // Status check styles
  statusGrid: {
    flexDirection: 'row',
    backgroundColor: colors.bgTooltip,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    gap: spacing.md,
  },
  statusColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusIcon: {
    marginRight: 2,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  statusTextActive: {
    color: colors.success,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
