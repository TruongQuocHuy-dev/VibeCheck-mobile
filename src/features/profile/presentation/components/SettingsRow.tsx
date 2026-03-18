import React, { memo } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../constants/colors';
import { spacing } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import { SettingsItem } from '../../domain/types/settings.types';

interface SettingsRowProps {
  item: SettingsItem;
  isLast?: boolean;
  toggleValue?: boolean;
  onPress: (item: SettingsItem) => void;
  onToggle: (value: boolean) => void;
}

export const SettingsRow: React.FC<SettingsRowProps> = memo(
  ({ item, isLast, toggleValue, onPress, onToggle }) => {
    const isDanger = item.type === 'danger';

    return (
      <TouchableOpacity
        style={[styles.row, !isLast && styles.rowDivider]}
        activeOpacity={item.type === 'toggle' ? 1 : 0.85}
        onPress={() => item.type !== 'toggle' && onPress(item)}
      >
        <View style={styles.leftContent}>
          <Icon
            name={item.icon}
            size={spacing.md}
            color={isDanger ? colors.error : item.iconColor || colors.primary}
          />
          <Text style={[styles.title, isDanger && styles.dangerTitle]}>{item.title}</Text>
        </View>

        {item.type === 'toggle' ? (
          <Switch
            value={Boolean(toggleValue)}
            onValueChange={onToggle}
            trackColor={{ false: colors.textMuted, true: colors.primary }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.textMuted}
          />
        ) : item.type === 'value' ? (
          <Text
            style={[
              styles.valueText,
              item.valueTone === 'primary' ? styles.valuePrimary : styles.valueMuted,
            ]}
          >
            {item.valueText}
          </Text>
        ) : (
          <Icon
            name={item.type === 'external' ? 'open-outline' : 'chevron-forward-outline'}
            size={spacing.md}
            color={colors.iconMuted}
          />
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  row: {
    minHeight: spacing.xxl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md_sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.overlayLight,
  },
  leftContent: {
    flex: 1,
    marginRight: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: spacing.sm_md,
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  dangerTitle: {
    color: colors.error,
  },
  valueText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  valuePrimary: {
    color: colors.primary,
  },
  valueMuted: {
    color: colors.textSecondary,
  },
});

SettingsRow.displayName = 'SettingsRow';
