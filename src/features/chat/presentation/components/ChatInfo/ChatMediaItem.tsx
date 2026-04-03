import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../../core/theme/spacing';
import { Message } from '../../../domain/types/chat.types';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 3;

interface ChatMediaItemProps {
  item: Message;
  index: number;
  type: 'media' | 'voice';
  onPress: () => void;
  isPlaying?: boolean;
  playTime?: string;
}

export const ChatMediaItem: React.FC<ChatMediaItemProps> = ({
  item,
  index,
  type,
  onPress,
  isPlaying,
  playTime,
}) => {
  if (type === 'voice') {
    return (
      <TouchableOpacity 
        style={styles.voiceContainer} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.voiceIconWrapper}>
          <Icon 
            name={isPlaying ? "pause" : "play"} 
            size={24} 
            color={isPlaying ? colors.messengerBlue : colors.white} 
          />
        </View>
        <View style={styles.voiceInfo}>
          <Text style={styles.voiceDate}>
            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </Text>
          <Text style={styles.voiceTime}>
            {isPlaying ? playTime : 'Tin nhắn thoại'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.mediaContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.mediaUrl }} 
        style={styles.thumbnail} 
      />
      {item.type === 'video' && (
        <View style={styles.playIconOverlay}>
          <Icon name="play" size={24} color={colors.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH,
    margin: 2,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.cardDark,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.whiteOpacity10,
    borderRadius: 12,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  voiceIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceDate: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
    marginBottom: 2,
  },
  voiceTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
