import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

export const SupportContactScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          activeOpacity={0.85} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={spacing.lg} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Liên hệ hỗ trợ</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.description}>
            Chào bạn! Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến đóng góp hoặc phản hồi về sự cố từ bạn.
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.iconWrap}>
              <Icon name="mail-outline" size={spacing.lg} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>support@vibecheck.app</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconWrap}>
              <Icon name="paper-plane-outline" size={spacing.lg} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Telegram</Text>
              <Text style={styles.infoValue}>@VibeCheck_Support</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} activeOpacity={0.9}>
          <Text style={styles.submitText}>GỬI TIN NHẮN CHO CHÚNG TÔI</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: colors.bgDark,
  },
  backButton: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgTooltip,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  headerSpacer: {
    width: spacing.xl + spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.bgTooltip,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.xl,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  description: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    lineHeight: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: spacing.xxl,
    height: spacing.xxl,
    borderRadius: borderRadius.md,
    backgroundColor: colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs / 2,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    height: spacing.xxl + spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  submitText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    letterSpacing: spacing.xs,
  },
});
