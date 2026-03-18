import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { useSettings } from '../../application/hooks/useSettings';
import { SettingsSectionCard } from '../components/SettingsSectionCard';

export const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    settingsSections,
    toggleState,
    appVersion,
    handleBack,
    handleToggle,
    handleItemPress,
    handleLogout,
  } = useSettings();

  const contentBottomPadding = insets.bottom + spacing.xxl;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={handleBack}>
          <Icon name="chevron-back" size={spacing.lg} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cài đặt</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: contentBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section) => (
          <SettingsSectionCard
            key={section.id}
            section={section}
            toggleState={toggleState}
            onItemPress={handleItemPress}
            onToggle={handleToggle}
          />
        ))}

        <View style={styles.logoutWrap}>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.9} onPress={handleLogout}>
            <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>{appVersion}</Text>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  logoutWrap: {
    paddingTop: spacing.sm,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: spacing.xxl + spacing.sm,
  },
  logoutText: {
    color: colors.error,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    letterSpacing: spacing.xs,
  },
  versionText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    letterSpacing: spacing.sm / 2,
    marginTop: spacing.md,
  },
});
