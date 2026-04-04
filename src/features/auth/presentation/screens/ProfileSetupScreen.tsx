import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useProfileSetup } from '../../application/hooks/useProfileSetup';
import { ProfileSetupScreenProps } from '../../domain/types/profile-setup.types';
import { AvatarPicker } from '../components/AvatarPicker';
import { BorderInput } from '../../../../components/atoms/BorderInput';
import { useLoading } from '../../../../shared/hooks/useLoading';
import { useToast } from '../../../../shared/hooks/useToast';


/**
 * Screen atom responsible for rendering the Profile Creation workflows.
 */
export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onComplete }) => {
  const {
    fullName, setFullName,
    nickname, setNickname,
    gender, setGender,
    birthYear, setBirthYear,
    avatarUri, handlePickAvatar,
    handleSubmit, errors, loading, error, isFormValid,
  } = useProfileSetup(onComplete);

  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (loading) {
      showLoading('Đang lưu hồ sơ...');
    } else {
      hideLoading();
    }
    return () => hideLoading(); // Ensure loading is hidden on unmount
  }, [loading, showLoading, hideLoading]);

  React.useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
            >
              <Icon name="arrow-left" size={24} color={colors.textOpacity60} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Tạo Vibe</Text>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isFormValid || loading}
              style={styles.headerNext}
            >
              <Text style={[styles.nextText, (!isFormValid || loading) && styles.nextTextDisabled]}>
                Bắt đầu
              </Text>
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
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <BorderInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Tên thật của bạn"
                iconName="account"
                testID="profile-setup-fullname-input"
              />
              {errors.fullName && <Text style={styles.errorFieldText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Biệt danh (tùy chọn)</Text>
              <BorderInput
                value={nickname}
                onChangeText={setNickname}
                placeholder="Có thể để trống"
                iconName="at"
                testID="profile-setup-nickname-input"
              />
              {errors.nickname && <Text style={styles.errorFieldText}>{errors.nickname}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Giới tính</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderOption, gender === 'male' && styles.genderOptionMaleActive]}
                  onPress={() => setGender('male')}
                  testID="profile-setup-gender-male"
                >
                  <Icon
                    name="gender-male"
                    size={20}
                    color={gender === 'male' ? colors.bgDark : colors.textPrimary}
                  />
                  <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Nam</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderOption, gender === 'female' && styles.genderOptionFemaleActive]}
                  onPress={() => setGender('female')}
                  testID="profile-setup-gender-female"
                >
                  <Icon
                    name="gender-female"
                    size={20}
                    color={gender === 'female' ? colors.bgDark : colors.textPrimary}
                  />
                  <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Nữ</Text>
                </TouchableOpacity>
              </View>
              {errors.gender && <Text style={styles.errorFieldText}>{errors.gender}</Text>}
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
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBlack,
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
  nextText: { color: colors.neonCyan, fontSize: 16, fontWeight: typography.weights.bold },
  nextTextDisabled: { color: colors.textSecondary, opacity: 0.5 },
  backButton: {
    padding: spacing.xs,
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
    color: colors.iconMuted,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderOption: {
    flex: 1,
    height: 54,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.cardDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  genderOptionMaleActive: {
    backgroundColor: colors.neonCyan,
    borderColor: colors.neonCyan,
  },
  genderOptionFemaleActive: {
    backgroundColor: colors.neonPink,
    borderColor: colors.neonPink,
  },
  genderText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  genderTextActive: {
    color: colors.bgDark,
  },
  submitSection: {
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },

  footerInfo: {
    fontSize: 10,
    color: colors.placeholder,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  errorFieldText: {
    color: colors.error,
    fontSize: 11,
    marginTop: 2,
    marginLeft: 4,
  },
});
