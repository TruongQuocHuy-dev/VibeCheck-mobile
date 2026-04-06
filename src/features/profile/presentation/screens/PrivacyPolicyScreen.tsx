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

export const PrivacyPolicyScreen: React.FC = () => {
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

        <Text style={styles.headerTitle}>Chính sách bảo mật</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>CHÚNG TÔI BẢO VỆ DỮ LIỆU CỦA BẠN!</Text>
        <Text style={styles.content}>
          Quyền riêng tư của bạn là ưu tiên hàng đầu của chúng tôi. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và chia sẻ thông tin của bạn.{"\n\n"}
          1. THÔNG TIN THU THẬP{"\n"}
          Chúng tôi thu thập thông tin hồ sơ (tên, giới tính, năm sinh), vị trí địa lý (để tìm kiếm tương hợp gần bạn), và dữ liệu tương tác trong ứng dụng.{"\n\n"}
          2. CÁCH LÀM VIỆC CỦA CHÚNG TÔI{"\n"}
          Dữ liệu của bạn được sử dụng để cung cấp và cải thiện dịch vụ, gợi ý những người có phong cách sống tương đồng và bảo vệ cộng đồng khỏi các hoạt động xấu.{"\n\n"}
          3. CHIA SẺ THÔNG TIN{"\n"}
          Chúng tôi không bao giờ bán thông tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ với đối tác kỹ thuật cần thiết cho sự vận hành của ứng dụng.{"\n\n"}
          4. QUYỀN CỦA BẠN{"\n"}
          Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa bỏ hoàn toàn dữ liệu cá nhân của mình bất cứ lúc nào thông qua phần quản lý tài khoản.
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
