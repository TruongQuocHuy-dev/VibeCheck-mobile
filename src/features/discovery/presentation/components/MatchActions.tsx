import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../constants/colors';
import { spacing } from '../../../../constants/spacing';

export interface MatchActionsProps {
  onChatPress: () => void;
  onBrowsePress: () => void;
  chatLabel?: string;
  browseLabel?: string;
}

export const MatchActions: React.FC<MatchActionsProps> = ({
  onChatPress,
  onBrowsePress,
  chatLabel = 'Nhắn tin ngay',
  browseLabel = 'Tiếp tục lướt',
}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={onChatPress}
      >
        <Icon name="chatbubble-ellipses" size={24} color={colors.bgBlack} />
        <Text style={styles.primaryButtonText}>{chatLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={onBrowsePress}
      >
        <Text style={styles.secondaryButtonText}>{browseLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.neonCyan,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.neonCyan,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: colors.bgBlack,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
