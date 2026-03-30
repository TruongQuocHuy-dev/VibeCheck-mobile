import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { colors } from '../../../../core/theme/colors';
import { spacing } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';

interface VibeModeSwitcherProps {
  mode: 'photo' | 'text';
  onModeChange: (mode: 'photo' | 'text') => void;
}

export const VibeModeSwitcher: React.FC<VibeModeSwitcherProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <View style={styles.modeSwitcher}>
      <TouchableOpacity
        onPress={() => onModeChange('text')}
        style={[styles.modeBtn, mode === 'text' && styles.modeBtnActive]}
      >
        <Text style={[styles.modeBtnTxt, mode === 'text' && styles.modeBtnTxtActive]}>
          VĂN BẢN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onModeChange('photo')}
        style={[styles.modeBtn, mode === 'photo' && styles.modeBtnActive]}
      >
        <Text style={[styles.modeBtnTxt, mode === 'photo' && styles.modeBtnTxtActive]}>
          CAMERA
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modeSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.xs,
  },
  modeBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  modeBtnActive: {
    borderBottomColor: colors.vibeCyan,
  },
  modeBtnTxt: {
    color: colors.textOpacity60,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
  },
  modeBtnTxtActive: {
    color: colors.vibeCyan,
  },
});
