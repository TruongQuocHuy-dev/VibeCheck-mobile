import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../core/theme/colors';
import { borderRadius, spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { useNotifications } from '../../application/hooks/useNotifications';
import { NotificationItemCard } from '../components/NotificationItemCard';

export const NotificationsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    title,
    tabs,
    activeTab,
    filteredItems,
    menuVisible,
    selectionMode,
    selectedIds,
    selectedCount,
    handleBack,
    handleToggleMenu,
    handleMarkAllRead,
    handleStartSelection,
    handleCancelSelection,
    handleDeleteSelected,
    handleDeleteAll,
    handleTabPress,
    handleNotificationLongPress,
    handleNotificationPress,
  } = useNotifications();

  const bottomPadding = insets.bottom + spacing.xxl;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <LinearGradient
        colors={[colors.bgDark, colors.cardDark, colors.bgDark]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.85}>
            <Icon name="arrow-back" size={spacing.lg} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <TouchableOpacity style={styles.menuButton} onPress={handleToggleMenu} activeOpacity={0.85}>
            <Icon name="ellipsis-vertical" size={spacing.md} color={colors.white} />
          </TouchableOpacity>
        </View>

        {menuVisible && (
          <View style={styles.menuPanel}>
            <TouchableOpacity style={styles.menuItem} onPress={handleMarkAllRead} activeOpacity={0.85}>
              <Icon name="mail-open-outline" size={spacing.md_sm} color={colors.textPrimary} />
              <Text style={styles.menuText}>Doc tat ca</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleStartSelection} activeOpacity={0.85}>
              <Icon name="checkmark-done-outline" size={spacing.md_sm} color={colors.textPrimary} />
              <Text style={styles.menuText}>Xoa theo chon</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]} onPress={handleDeleteAll} activeOpacity={0.85}>
              <Icon name="trash-outline" size={spacing.md_sm} color={colors.error} />
              <Text style={[styles.menuText, styles.menuTextDanger]}>Xoa tat ca</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectionMode && (
          <View style={styles.selectionBar}>
            <Text style={styles.selectionText}>{`${selectedCount} muc da chon`}</Text>

            <View style={styles.selectionActions}>
              <TouchableOpacity
                style={[styles.selectionActionButton, selectedCount === 0 && styles.selectionActionButtonDisabled]}
                onPress={handleDeleteSelected}
                activeOpacity={0.85}
                disabled={selectedCount === 0}
              >
                <Icon name="trash-outline" size={spacing.md_sm} color={selectedCount === 0 ? colors.textMuted : colors.error} />
                <Text style={[styles.selectionActionText, selectedCount === 0 && styles.selectionActionTextDisabled]}>
                  Xoa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.selectionActionButton} onPress={handleCancelSelection} activeOpacity={0.85}>
                <Text style={styles.selectionActionText}>Huy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.tabsRow}>
          {tabs.map((tab) => {
            const active = tab.id === activeTab;

            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabButton}
                activeOpacity={0.9}
                onPress={() => handleTabPress(tab.id)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
                <View style={[styles.tabLine, active && styles.tabLineActive]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <NotificationItemCard
              key={item.id}
              item={item}
              onPress={handleNotificationPress}
              onLongPress={handleNotificationLongPress}
              selectionMode={selectionMode}
              isSelected={selectedIds.includes(item.id)}
              style={styles.notificationCard}
            />
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <Icon name="notifications-off-outline" size={spacing.xxl} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Khong co thong bao</Text>
            <Text style={styles.emptySubtitle}>Thu tab khac hoac quay lai sau.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.overlayLight,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backButton: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.bgTooltip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  menuButton: {
    width: spacing.xl + spacing.sm,
    height: spacing.xl + spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuPanel: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.cardDark,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  menuItem: {
    minHeight: spacing.xl + spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  menuItemDanger: {
    borderTopWidth: 1,
    borderTopColor: colors.overlayLight,
  },
  menuText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  menuTextDanger: {
    color: colors.error,
  },
  selectionBar: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
    backgroundColor: colors.cyanBg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionText: {
    color: colors.neonCyan,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  selectionActionButton: {
    minHeight: spacing.lg + spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.bgTooltip,
    paddingHorizontal: spacing.sm_md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  selectionActionButtonDisabled: {
    opacity: 0.5,
  },
  selectionActionText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
  },
  selectionActionTextDisabled: {
    color: colors.textMuted,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tabButton: {
    gap: spacing.xs,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabLine: {
    height: 2,
    borderRadius: borderRadius.full,
    backgroundColor: 'transparent',
  },
  tabLineActive: {
    backgroundColor: colors.primary,
  },
  contentContainer: {
    padding: spacing.md,
  },
  notificationCard: {
    marginBottom: spacing.md,
  },
  emptyWrap: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.lg,
  },
});
