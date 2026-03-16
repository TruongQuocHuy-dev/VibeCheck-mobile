import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { spacing, sizes } from '../../constants/spacing';
import { typography } from '../../constants/typography';

/**
 * Props for the Keypad molecule component.
 */
export interface KeypadProps {
  /**
   * Callback fired when a numerical or action key is pressed.
   * Sends 'delete' or the tapped digit string.
   */
  onKeyPress: (key: string) => void;
}

/**
 * Keypad component rendering a grid of items for inputting codes or pins.
 */
export const Keypad: React.FC<KeypadProps> = ({ onKeyPress }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  return (
    <View style={styles.keypadContainer}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keypadRow}>
          {row.map((key, colIndex) => {
            if (key === '') {
              return <View key={colIndex} style={styles.keyItem} />;
            }
            const isDelete = key === 'delete';
            return (
              <TouchableOpacity
                key={colIndex}
                style={styles.keyItem}
                onPress={() => onKeyPress(key)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={isDelete ? 'Xóa số' : `Số ${key}`}
                testID={`keypad-item-${key}`}
              >
                {isDelete ? (
                  <Icon name="backspace-outline" size={sizes.iconBack} color={colors.textPrimary} />
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  keypadContainer: {
    marginTop: spacing.md,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  keyItem: {
    width: '30%',
    aspectRatio: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 28, // Local dimension suited for standard keypad
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
});
