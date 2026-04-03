import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../../core/theme/spacing';

interface ChatMediaTabsProps {
  activeTab: 'media' | 'voice';
  onTabChange: (tab: 'media' | 'voice') => void;
}

export const ChatMediaTabs: React.FC<ChatMediaTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'media' && styles.activeTab]}
        onPress={() => onTabChange('media')}
      >
        <Text style={[styles.tabLabel, activeTab === 'media' && styles.activeTabLabel]}>
          Ảnh & Video
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'voice' && styles.activeTab]}
        onPress={() => onTabChange('voice')}
      >
        <Text style={[styles.tabLabel, activeTab === 'voice' && styles.activeTabLabel]}>
          Tin nhắn thoại
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bgDark,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.messengerBlue,
  },
  tabLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeTabLabel: {
    color: colors.white,
  },
});
