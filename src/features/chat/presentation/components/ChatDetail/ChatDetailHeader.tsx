import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../../core/theme/colors';
import { spacing } from '../../../../../core/theme/spacing';

interface ChatDetailHeaderProps {
  name: string;
  avatar?: string | null;
  isOnline?: boolean;
  lastActive?: string | null;
  isBlocked?: boolean;
  onBack: () => void;
  onInfo?: () => void;
  formatLastActive?: (date: string | null) => string;
  isInfoMode?: boolean;
}

export const ChatDetailHeader: React.FC<ChatDetailHeaderProps> = ({
  name,
  avatar,
  isOnline, // Default to undefined to detect "Hidden"
  lastActive = null,
  isBlocked = false,
  onBack,
  onInfo,
  formatLastActive,
  isInfoMode = false,
}) => {
  // Show status if data is available (not hidden by privacy)
  const hasStatus = isOnline !== undefined || (lastActive !== null && lastActive !== undefined);

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        
        {isInfoMode ? (
          <Text style={styles.headerName}>{name}</Text>
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatar || 'https://via.placeholder.com/150' }} style={styles.headerAvatar} />
              {isOnline && !isBlocked && <View style={styles.onlineBadge} />}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{name}</Text>
              {!isBlocked && hasStatus && (
                <Text style={[styles.headerStatus, isOnline && styles.headerStatusOnline]}>
                  {isOnline ? 'Đang hoạt động' : formatLastActive?.(lastActive)}
                </Text>
              )}
            </View>
          </>
        )}
      </View>
      
      {!isInfoMode && (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={onInfo}>
            <Icon name="information-circle-outline" size={26} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md_sm,
    height: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surfaceHigh,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backButton: { padding: spacing.xs, marginRight: spacing.sm },
  headerAvatar: { width: 32, height: 32, borderRadius: 16 },
  avatarContainer: { position: 'relative', marginRight: spacing.sm_md },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.neonGreen,
    borderWidth: 2,
    borderColor: colors.bgDark,
    shadowColor: colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerInfo: { justifyContent: 'center' },
  headerName: { color: colors.white, fontSize: 15, fontWeight: 'bold' },
  headerStatus: { color: colors.textSecondary, fontSize: 11 },
  headerStatusOnline: { color: colors.neonGreen, fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  headerIcon: { padding: 2 },
});
