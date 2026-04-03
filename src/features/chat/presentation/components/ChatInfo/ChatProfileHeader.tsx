import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../../core/theme/spacing';
import { CHAT_STRINGS } from '../../../domain/constants/chat.constants';

interface ChatProfileHeaderProps {
  name: string;
  avatar: string | null;
  isBlocked: boolean;
  onViewProfile: () => void;
  onClearChat: () => void;
  onBlock: () => void;
}

export const ChatProfileHeader: React.FC<ChatProfileHeaderProps> = ({
  name,
  avatar,
  isBlocked,
  onViewProfile,
  onClearChat,
  onBlock,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: avatar || 'https://via.placeholder.com/150' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{name}</Text>
      
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionItem} onPress={onViewProfile}>
          <View style={styles.iconCircle}>
            <Icon name="person" size={20} color={colors.white} />
          </View>
          <Text style={styles.actionLabel}>{CHAT_STRINGS.view_profile}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onClearChat}>
          <View style={styles.iconCircle}>
            <Icon name="trash" size={20} color={colors.white} />
          </View>
          <Text style={styles.actionLabel}>Xóa chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={onBlock}>
          <View style={[styles.iconCircle, isBlocked && styles.blockedCircle]}>
            <Icon name="ban" size={20} color={isBlocked ? colors.error : colors.white} />
          </View>
          <Text style={[styles.actionLabel, isBlocked && styles.blockedLabel]}>
            {isBlocked ? CHAT_STRINGS.unblock : 'Chặn'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.bgDark,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.whiteOpacity10,
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Outfit-Bold',
    color: colors.white,
    marginBottom: spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    width: '100%',
  },
  actionItem: {
    alignItems: 'center',
    width: 80,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.whiteOpacity10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  blockedCircle: {
    backgroundColor: colors.pinkBg,
    borderColor: colors.error,
    borderWidth: 1,
  },
  actionLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  blockedLabel: {
    color: colors.error,
  },
});
