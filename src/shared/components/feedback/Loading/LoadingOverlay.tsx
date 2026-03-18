import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type LoadingOverlayProps = {
  visible: boolean;
  message?: string;
};

export const LoadingOverlay = ({ visible, message }: LoadingOverlayProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    zIndex: 998,
  },
  card: {
    minWidth: 140,
    borderRadius: 12,
    backgroundColor: '#111827',
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  message: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
