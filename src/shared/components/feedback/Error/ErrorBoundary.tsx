import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Đã xảy ra lỗi không xác định.',
    };
  }

  componentDidCatch(error: Error): void {
    console.error('ErrorBoundary caught an error', error);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Ồ! Có lỗi xảy ra rồi</Text>
          <Text style={styles.message}>{this.state.message}</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={this.handleReload}>
            <Text style={styles.reloadText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.bgDark,
    gap: spacing.md,
  },
  emoji: {
    fontSize: typography.sizes.display,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  reloadButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.neonCyan,
    paddingVertical: spacing.sm_md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  reloadText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
});
