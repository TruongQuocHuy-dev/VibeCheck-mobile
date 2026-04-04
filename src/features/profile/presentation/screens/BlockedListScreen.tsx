import React from 'react';
import {
  FlatList,
  Image,
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
import { useBlockedList, BlockedUser } from '../../application/hooks/useBlockedList';
import { EmptyState } from '../../../../shared/components/feedback/Empty';
import { LoadingOverlay } from '../../../../shared/components/feedback/Loading';

export const BlockedListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { blockedUsers, isLoadingList, handleUnblock, refreshList } = useBlockedList();

  const handleBack = () => navigation.goBack();

  const renderItem = ({ item }: { item: BlockedUser }) => (
    <View style={styles.userCard}>
      <Image
        source={item.avatar ? { uri: item.avatar } : undefined}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName || item.displayName}</Text>
        <Text style={styles.userBio} numberOfLines={1}>{item.bio || 'Không có tiểu sử'}</Text>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblock(item._id)}
        activeOpacity={0.7}
      >
        <Text style={styles.unblockText}>Bỏ chặn</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={handleBack}>
          <Icon name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách chặn</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {isLoadingList ? (
          <LoadingOverlay visible={true} message="Đang tải danh sách..." />
        ) : blockedUsers.length === 0 ? (
          <EmptyState
            emoji="🔒"
            title="Danh sách trống"
            subtitle="Bạn chưa chặn bất kỳ ai hoặc đã bỏ chặn tất cả mọi người."
            actionLabel="Tải lại"
            onActionPress={refreshList}
          />
        ) : (
          <FlatList
            data={blockedUsers}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
  content: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.bgTooltip,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userBio: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  unblockButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  unblockText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
