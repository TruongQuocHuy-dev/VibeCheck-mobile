import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

export type ToastPayload = {
  message: string;
  type: ToastType;
};

type ToastViewProps = {
  visible: boolean;
  toast: ToastPayload | null;
};

const backgroundByType: Record<ToastType, string> = {
  success: '#16A34A',
  error: '#DC2626',
  info: '#2563EB',
};

export const ToastView = ({ visible, toast }: ToastViewProps) => {
  if (!visible || !toast) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.wrapper}>
      <View style={[styles.toast, { backgroundColor: backgroundByType[toast.type] }]}>
        <Text style={styles.message}>{toast.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 24,
    left: 16,
    right: 16,
    zIndex: 999,
    alignItems: 'center',
  },
  toast: {
    minHeight: 44,
    maxWidth: '100%',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
