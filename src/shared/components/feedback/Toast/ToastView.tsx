import React from 'react';
import { StyleSheet, Text, View, Animated, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useToastGesture } from './useToastGesture';

type ToastType = 'success' | 'error' | 'info';

export type ToastPayload = {
  message: string;
  type: ToastType;
};

type ToastViewProps = {
  visible: boolean;
  toast: ToastPayload | null;
  onDismiss: () => void;
};

const UI_CONFIG: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: { bg: '#F0FDF4', border: '#22C55E', icon: 'check-circle' },
  error: { bg: '#FEF2F2', border: '#EF4444', icon: 'x-circle' },
  info: { bg: '#EFF6FF', border: '#3B82F6', icon: 'info' },
};

export const ToastView = ({ visible, toast, onDismiss }: ToastViewProps) => {
  const { mounted, pan, opacity, panResponder } = useToastGesture(visible, onDismiss);

  if (!mounted || !toast) {
    return null;
  }

  const animStyle = {
    opacity,
    transform: pan.getTranslateTransform(),
  };

  const config = UI_CONFIG[toast.type] || UI_CONFIG.info;

  return (
    <Animated.View
      style={[styles.wrapper, animStyle]}
      {...panResponder.panHandlers}
      pointerEvents="box-none"
    >
      <View style={[styles.toast, { backgroundColor: config.bg, borderColor: config.border }]}>
        <Icon name={config.icon} size={22} color={config.border} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: config.border }]}>
            {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Notice'}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {toast.message}
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" style={styles.dragHint} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  dragHint: {
    marginLeft: 8,
    opacity: 0.6,
  },
});
