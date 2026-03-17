import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../constants/colors';

export const MatchesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches 💕</Text>
      <Text style={styles.subtitle}>Xem ai thích bạn</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark || '#0F0F1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary || '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary || '#A0A0B0',
  },
});
