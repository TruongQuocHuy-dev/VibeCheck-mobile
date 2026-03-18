import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../../constants/colors';
import { borderRadius, spacing } from '../../../../constants/spacing';
import { typography } from '../../../../constants/typography';
import {
  SettingsItem,
  SettingsSection,
  SettingsToggleKey,
  SettingsToggleState,
} from '../../domain/types/settings.types';
import { SettingsRow } from './SettingsRow';

interface SettingsSectionCardProps {
  section: SettingsSection;
  toggleState: SettingsToggleState;
  onItemPress: (item: SettingsItem) => void;
  onToggle: (key: SettingsToggleKey, value: boolean) => void;
}

export const SettingsSectionCard: React.FC<SettingsSectionCardProps> = memo(
  ({ section, toggleState, onItemPress, onToggle }) => {
    return (
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionTitle}>{section.title}</Text>

        <View style={styles.card}>
          {section.items.map((item, index) => {
            const isLast = index === section.items.length - 1;
            const toggleValue = item.toggleKey ? toggleState[item.toggleKey] : undefined;

            return (
              <SettingsRow
                key={item.id}
                item={item}
                isLast={isLast}
                toggleValue={toggleValue}
                onPress={onItemPress}
                onToggle={(value) => item.toggleKey && onToggle(item.toggleKey, value)}
              />
            );
          })}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  sectionWrap: {
    gap: spacing.sm,
  },
  sectionTitle: {
    marginLeft: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: spacing.xs,
  },
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.bgTooltip,
    overflow: 'hidden',
  },
});

SettingsSectionCard.displayName = 'SettingsSectionCard';
