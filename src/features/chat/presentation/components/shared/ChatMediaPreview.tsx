import React from 'react';
import { View, Modal, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../../../core/theme/colors';
import { spacing } from '../../../../../core/theme/spacing';
import { Message } from '../../../domain/types/chat.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChatMediaPreviewProps {
  visible: boolean;
  onClose: () => void;
  data: any[];
  initialIndex: number;
  onSave?: (uri: string) => void;
}

export const ChatMediaPreview: React.FC<ChatMediaPreviewProps> = ({
  visible,
  onClose,
  data,
  initialIndex,
  onSave,
}) => {
  const getUri = (item: any): string => {
    if (!item) return '';
    return typeof item === 'string' ? item : (item.url || item.uri || '');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.previewContainer}>
        <TouchableOpacity 
          style={styles.previewOverlay} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        <View style={styles.previewContent}>
          <FlatList
            data={data}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex > data.length - 1 ? 0 : initialIndex}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            keyExtractor={(_, index) => `media_${index}`}
            renderItem={({ item }) => {
              const uri = getUri(item);
              if (!uri) return <View style={styles.slide} />;
              return (
                <View style={styles.slide}>
                  <Image source={{ uri }} style={styles.previewImage} resizeMode="contain" />
                </View>
              );
            }}
          />
        </View>
        <TouchableOpacity 
          style={[styles.actionBtn, { top: spacing.xl }]} 
          onPress={onClose}
        >
          <Icon name="close" size={28} color={colors.white} />
        </TouchableOpacity>

        {onSave && data.length > 0 && (
          <TouchableOpacity 
            style={[styles.actionBtn, { top: spacing.xl, right: spacing.xl + 40 }]} 
            onPress={() => onSave(getUri(data[initialIndex]))}
          >
            <Icon name="download-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  previewContent: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  actionBtn: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
});
