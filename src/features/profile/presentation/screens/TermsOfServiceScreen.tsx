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

export const TermsOfServiceScreen: React.FC = () => {
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

        <Text style={styles.headerTitle}>Điều khoản dịch vụ</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>CHÀO MỪNG BẠN ĐẾN VỚI VIBECHECK!</Text>
        <Text style={styles.content}>
          Bằng việc sử dụng VibeCheck, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Vui lòng đọc kỹ trước khi bắt đầu hành trình của bạn.{"\n\n"}
          1. QUYỀN SỞ HỮU TRÍ TUỆ{"\n"}
          Mọi nội dung trên ứng dụng, bao gồm logo, mã nguồn, và nội dung đồ họa thuộc quyền sở hữu của VibeCheck.{"\n\n"}
          2. TRÁCH NHIỆM NGƯỜI DÙNG{"\n"}
          Người dùng phải đủ 18 tuổi để tham gia. Bạn chịu trách nhiệm về nội dung mình đăng tải và cam kết không vi phạm pháp luật.{"\n\n"}
          3. CHẤM DỨT TÀI KHOẢN{"\n"}
          Chúng tôi có quyền tạm ngừng hoặc xóa vĩnh viễn tài khoản nếu phát hiện hành vi gian lận hoặc vi phạm các chuẩn mực cộng đồng.{"\n\n"}
          4. THAY ĐỔI ĐIỀU KHOẢN{"\n"}
          VibeCheck có quyền thay đổi các điều khoản này bất cứ lúc nào. Sự tiếp tục sử dụng của bạn sau các thay đổi đồng nghĩa với việc bạn chấp nhận chúng.
        </Text>

        <Text style={styles.date}>Cập nhật lần cuối: 06/04/2026</Text>
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
    padding: spacing.lg,
  },
  title: {
    color: colors.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.lg,
    textTransform: 'uppercase',
  },
  content: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xxl,
    textAlign: 'right',
  },
});
