import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../../core/theme/colors';
import { spacing, sizes } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useProfileSetup } from '../../application/hooks/useProfileSetup';
import { ProfileSetupScreenProps } from '../../domain/types/profile-setup.types';
import { AvatarPicker } from '../components/AvatarPicker';
import { BorderInput } from '../../../../components/atoms/BorderInput';
import { GradientButton } from '../../../../components/atoms/GradientButton';
import { useLoading } from '../../../../shared/hooks/useLoading';
import { useToast } from '../../../../shared/hooks/useToast';


/**
 * Screen atom responsible for rendering the Profile Creation workflows.
 */
export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onComplete }) => {
  const {
    nickname, setNickname,
    birthYear, setBirthYear,
    avatarUri, handlePickAvatar,
    handleSubmit, errors, loading, error
  } = useProfileSetup(onComplete);

  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (loading) {
      showLoading('Đang lưu hồ sơ...');
    } else {
      hideLoading();
    }
  }, [loading, showLoading, hideLoading]);

  React.useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

  const isFormValid = nickname.trim().length > 0 && birthYear.length === 4;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
            >
              <Icon name="arrow-left" size={24} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tạo Vibe</Text>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isFormValid || loading}
              style={styles.headerNext}
            >
              <Text style={[styles.nextText, (!isFormValid || loading) && styles.nextTextDisabled]}>Bắt đầu</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar Section */}
          <AvatarPicker
            avatarUri={avatarUri}
            onPickAvatar={handlePickAvatar}
            testID="profile-setup-avatar-picker"
          />

          {/* Inputs Section */}
          <View style={styles.inputsSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Biệt danh</Text>
              <BorderInput
                value={nickname}
                onChangeText={setNickname}
                placeholder="Không cần tên thật"
                iconName="at"
                testID="profile-setup-nickname-input"
              />
              {errors.nickname && <Text style={styles.errorFieldText}>{errors.nickname}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Năm sinh</Text>
              <BorderInput
                value={birthYear}
                onChangeText={setBirthYear}
                placeholder="VD: 2002"
                iconName="cake-variant"
                keyboardType="number-pad"
                maxLength={4}
                testID="profile-setup-year-input"
              />
              {errors.birthYear && <Text style={styles.errorFieldText}>{errors.birthYear}</Text>}
            </View>


          </View>


          {/* Submit Section */}
          <View style={styles.submitSection}>
            <Text style={styles.footerInfo}>
              Thông tin của bạn được bảo vệ bởi VibeCheck Protocol v2.0
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Background Dark Prototype
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  headerNext: { paddingHorizontal: spacing.sm, paddingVertical: 8 },
  nextText: { color: colors.neonCyan || '#00F0FF', fontSize: 16, fontWeight: typography.weights.bold },
  nextTextDisabled: { color: colors.textSecondary, opacity: 0.5 },
  backButton: {
    padding: spacing.xs,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
  stepDotActive: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neonPink || '#f20d80',
  },
  stepDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputsSection: {
    gap: spacing.md,
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  submitSection: {
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },

  footerInfo: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorFieldText: {
    color: '#FF4D4D',
    fontSize: 11,
    marginTop: 2,
    marginLeft: 4,
  },
});
