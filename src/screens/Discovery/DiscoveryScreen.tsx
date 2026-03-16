import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const DiscoveryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discovery 🏠</Text>
      <Text style={styles.subtitle}>Feed chính cho Gen Z</Text>
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
