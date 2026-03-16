import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import { spacing, sizes } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useProfileSetup } from '../../hooks/auth/useProfileSetup';
import { ProfileSetupScreenProps } from '../../types/presentation/auth/profile-setup.types';
import { AvatarPicker } from '../../components/molecules/AvatarPicker';
import { BorderInput } from '../../components/atoms/BorderInput';
import { GradientButton } from '../../components/atoms/GradientButton';


/**
 * Screen atom responsible for rendering the Profile Creation workflows.
 */
export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onComplete }) => {
  const { nickname, birthYear, avatarUri, setNickname, setBirthYear, handlePickAvatar, handleSubmit } = useProfileSetup(onComplete);

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
            <Text style={styles.headerTitle}>Tạo Vibe của bạn</Text>
            
            <View style={styles.stepIndicator}>
              <View style={styles.stepDotActive} />
              <View style={styles.stepDot} />
              <View style={styles.stepDot} />
            </View>
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
            </View>
          </View>


          {/* Submit Section */}
          <View style={styles.submitSection}>
            <GradientButton
              title="Bắt đầu quẹt Vibe ⚡"
              onPress={handleSubmit}
              disabled={!isFormValid}
              testID="profile-setup-submit-button"
            />

            
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
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: spacing.lg,
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
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
});
