import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { WelcomeScreenProps } from '../../domain/types/welcome.types';
import { ASSETS } from '../../../../assets/assets';
import { colors } from '../../../../constants/colors';

import { spacing, sizes } from '../../../../constants/spacing';
import { GradientButton } from '../../../../components/atoms/GradientButton';
import { typography } from '../../../../constants/typography';
import { shadows, textShadows } from '../../../../constants/styles';

import { useWelcomeAnimations } from '../../application/hooks/useWelcomeAnimations';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoginSuccess }) => {
  const { floatingStyle, pulsingStyle } = useWelcomeAnimations();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePhoneLogin = () => {
    navigation.navigate('OtpScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Absolute Background Glows */}
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />

      <View style={styles.content}>
        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Central Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconWrapper}>
            {/* Pulsing Behind Glow */}
            <Animated.View style={[styles.pulseGlow, pulsingStyle]} />

            {/* Main Glassmorphism Contnainer */}
            <View style={styles.glassContainer}>
              <Icon
                name="heart"
                size={sizes.iconHeart}
                color={colors.primaryPink}
                style={styles.mainIcon}
                accessibilityLabel="Biểu tượng tim"
              />
            </View>

            {/* Floating chat Accent */}
            <Animated.View style={[styles.floatingAccent, floatingStyle]}>
              <View style={styles.accentGlass}>
                <Icon name="chatbubble-ellipses" size={sizes.iconAccent} color={colors.white} accessibilityLabel="Bong bóng chat" />
              </View>
            </Animated.View>
          </View>

          {/* Typography */}
          <Text style={styles.title}>VibeCheck</Text>
          <Text style={styles.subtitle}>Hợp tần số, mới lộ diện.</Text>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Action Buttons Area */}
        <View style={styles.buttonArea}>
          {/* Phone Button */}
          <GradientButton
            title="Tiếp tục với Số điện thoại"
            leftIcon="call"
            onPress={handlePhoneLogin}
            testID="welcome-phone-button"
          />

          {/* Google Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            accessibilityLabel="Tiếp tục với Google"
            accessibilityRole="button"
          >
            <Image
              source={{ uri: ASSETS.URLS.GOOGLE_LOGO }}
              style={styles.googleLogo}
            />
            <Text style={styles.secondaryButtonText}>Tiếp tục với Google</Text>
          </TouchableOpacity>

          {/* Terms Text */}
          <Text style={styles.termsText} accessibilityRole="text">
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL(ASSETS.URLS.TERMS)}
              accessibilityRole="link"
              accessibilityLabel="Điều khoản"
            >
              Điều khoản
            </Text>{' '}
            và{' '}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL(ASSETS.URLS.PRIVACY)}
              accessibilityRole="link"
              accessibilityLabel="Quyền riêng tư"
            >
              Quyền riêng tư
            </Text>{' '}
            của chúng tôi.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    opacity: 0.15,
  },
  glowTop: {
    top: -height * 0.2,
    left: -width * 0.3,
    backgroundColor: colors.primaryPink,
  },
  glowBottom: {
    bottom: -height * 0.2,
    right: -width * 0.3,
    backgroundColor: colors.primaryPurple,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconWrapper: {
    width: sizes.wrapper,
    height: sizes.wrapper,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  pulseGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primaryPink,
    opacity: 0.2,
  },
  glassContainer: {
    width: sizes.glass,
    height: sizes.glass,
    borderRadius: sizes.glassRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glass,
  },
  mainIcon: {
    ...shadows.glow,
  },
  floatingAccent: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 10,
  },
  accentGlass: {
    padding: spacing.md_sm,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...shadows.accent,
    transform: [{ rotate: '12deg' }],
  },
  title: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.heavy,
    color: colors.textPrimary,
    marginBottom: spacing.sm_md,
    letterSpacing: -1,
    ...textShadows.neon,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
    fontWeight: typography.weights.regular,
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 22,
  },
  buttonArea: {
    width: '100%',
    marginBottom: spacing.sm_md,
    gap: spacing.md,
  },
  primaryButtonWrapper: {
    width: '100%',
    borderRadius: 9999,
    ...shadows.button,
  },
  primaryButton: {
    flexDirection: 'row',
    height: sizes.button,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: 'row',
    height: sizes.button,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  googleLogo: {
    width: sizes.googleLogo,
    height: sizes.googleLogo,
    marginRight: spacing.sm_md,
    resizeMode: 'contain',
  },
  termsText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    lineHeight: 18,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: colors.primaryPink,
  },
});
