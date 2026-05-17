import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { shadows, textShadows } from '../../../../core/theme/styles';

const { width, height } = Dimensions.get('window');

interface SuspendedScreenProps {
  banReason?: string;
  onLogout: () => Promise<void>;
}

export const SuspendedScreen: React.FC<SuspendedScreenProps> = ({
  banReason = 'Vi phạm Tiêu chuẩn Cộng đồng của chúng tôi.',
  onLogout,
}) => {
  const [appealSent, setAppealSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleAppeal = () => {
    if (appealSent) return;

    Alert.alert(
      'Gửi yêu cầu xem xét lại',
      'Bạn có chắc chắn muốn yêu cầu xem xét lại quyết định đình chỉ tài khoản này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Gửi yêu cầu',
          onPress: async () => {
            setSubmitting(true);
            // Simulate API request to appeal
            setTimeout(() => {
              setSubmitting(false);
              setAppealSent(true);
              Alert.alert(
                'Đã gửi yêu cầu',
                'Yêu cầu của bạn đã được tiếp nhận thành công. Đội ngũ kiểm duyệt VibeCheck sẽ tiến hành xem xét lại hồ sơ và phản hồi cho bạn qua SMS/Email trong vòng 24 đến 48 giờ.',
                [{ text: 'Đồng ý' }]
              );
            }, 1500);
          },
        },
      ]
    );
  };

  const handleLogoutPress = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể đăng xuất vào lúc này. Vui lòng thử lại sau.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Glows matching main Welcome theme */}
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {/* Glowing background behind shield */}
            <View style={styles.pulseGlow} />
            <View style={styles.glassContainer}>
              <Icon
                name="shield-sharp"
                size={70}
                color={colors.error}
                style={styles.shieldIcon}
              />
              <Icon
                name="alert"
                size={28}
                color={colors.white}
                style={styles.warningIcon}
              />
            </View>
          </View>
          <Text style={styles.title}>Tài khoản bị đình chỉ</Text>
          <Text style={styles.subtitle}>
            Chúng tôi đã tạm khóa tài khoản của bạn vì phát hiện vi phạm nguyên tắc cộng đồng.
          </Text>
        </View>

        {/* Info & Reason Cards */}
        <View style={styles.infoArea}>
          {/* Action limitations Checklist */}
          <View style={styles.checklist}>
            <View style={styles.checkItem}>
              <View style={styles.bulletDotBanned}>
                <Icon name="ban-outline" size={18} color={colors.error} />
              </View>
              <Text style={styles.checkText}>
                Hồ sơ của bạn đã bị ẩn và không còn hiển thị với bất kỳ ai khác.
              </Text>
            </View>

            <View style={styles.checkItem}>
              <View style={styles.bulletDotBanned}>
                <Icon name="chatbubble-xmark-outline" size={18} color={colors.error} />
              </View>
              <Text style={styles.checkText}>
                Tính năng nhắn tin, tạo vibe và kết nối đã bị vô hiệu hóa.
              </Text>
            </View>

            <View style={styles.checkItem}>
              <View style={styles.bulletDotBanned}>
                <Icon name="lock-closed-outline" size={18} color={colors.error} />
              </View>
              <Text style={styles.checkText}>
                Quyết định này có hiệu lực ngay lập tức.
              </Text>
            </View>
          </View>

          {/* Frosted Glass Custom Reason Box */}
          <View style={styles.reasonBox}>
            <Text style={styles.reasonLabel}>Chi tiết lý do:</Text>
            <Text style={styles.reasonText}>{banReason}</Text>
          </View>

          <Text style={styles.instructionText}>
            Nếu cho rằng đây là một sự nhầm lẫn, bạn có thể gửi yêu cầu xem xét lại để ban kiểm duyệt hỗ trợ xác minh lại tài khoản của bạn.
          </Text>
        </View>

        {/* Footer Actions */}
        <View style={styles.buttonArea}>
          {/* Primary Action Button (Request Review / Appeal) */}
          <TouchableOpacity
            style={[styles.primaryButton, appealSent && styles.disabledButton]}
            activeOpacity={0.8}
            onPress={handleAppeal}
            disabled={submitting || appealSent}
          >
            <LinearGradient
              colors={appealSent ? ['#555566', '#444455'] : ['#f20d80', '#9333ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {submitting ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Icon
                    name={appealSent ? 'checkmark-circle-outline' : 'paper-plane-outline'}
                    size={20}
                    color={colors.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.primaryButtonText}>
                    {appealSent ? 'Yêu cầu đang được xem xét' : 'Yêu cầu xem xét lại'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Action Button (Log out) */}
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={handleLogoutPress}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <Icon
                  name="log-out-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.secondaryButtonText}>Đăng xuất tài khoản</Text>
              </>
            )}
          </TouchableOpacity>
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
    opacity: 0.12,
  },
  glowTop: {
    top: -height * 0.2,
    left: -width * 0.3,
    backgroundColor: colors.error,
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  header: {
    alignItems: 'center',
    width: '100%',
    marginTop: spacing.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  pulseGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.error,
    opacity: 0.25,
    ...shadows.glow,
  },
  glassContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 71, 87, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 71, 87, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glass,
  },
  shieldIcon: {
    ...shadows.glow,
  },
  warningIcon: {
    position: 'absolute',
    top: 38,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: typography.weights.heavy,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
    ...textShadows.neon,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
  },
  infoArea: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    padding: spacing.md_sm,
    ...shadows.glass,
  },
  checklist: {
    width: '100%',
    gap: spacing.sm_md,
    marginBottom: spacing.md,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletDotBanned: {
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  reasonBox: {
    backgroundColor: 'rgba(255, 71, 87, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.15)',
    borderRadius: 16,
    padding: spacing.sm_md,
    marginBottom: spacing.sm_md,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.error,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 20,
  },
  instructionText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.sm,
  },
  buttonArea: {
    width: '100%',
    gap: spacing.sm_md,
    marginBottom: spacing.sm,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 9999,
    ...shadows.button,
  },
  gradientButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
