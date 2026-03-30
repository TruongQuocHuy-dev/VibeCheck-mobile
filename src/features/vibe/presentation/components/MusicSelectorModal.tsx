import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme/typography';
import { MusicOptionCard } from './MusicOptionCard';
import { VibeMusicTrimmer } from './VibeMusicTrimmer';

interface MusicSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  searchKeyword: string;
  onSearchChange: (text: string) => void;
  tracks: any[];
  isSearching: boolean;
  selectedTrackId: string | null;
  playingTrackId: string | null;
  selectedTrack: any | null;
  onTrackSelect: (track: any) => void;
  startTime: number;
  musicDuration: number;
  currentPlayTime: number;
  onStartTimeChange: (val: number) => void;
  bottomInset: number;
}

export const MusicSelectorModal: React.FC<MusicSelectorModalProps> = ({
  visible,
  onClose,
  searchKeyword,
  onSearchChange,
  tracks,
  isSearching,
  selectedTrackId,
  playingTrackId,
  selectedTrack,
  onTrackSelect,
  startTime,
  musicDuration,
  currentPlayTime,
  onStartTimeChange,
  bottomInset,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalKAV}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={[styles.musicSheet, { paddingBottom: bottomInset + spacing.md }]}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Thêm nhạc</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="check" size={24} color={colors.vibeCyan} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrap}>
            <Icon name="magnify" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm bài hát, nghệ sĩ..."
              placeholderTextColor={colors.textMuted}
              value={searchKeyword}
              onChangeText={onSearchChange}
            />
            {searchKeyword.length > 0 && (
              <TouchableOpacity onPress={() => onSearchChange('')}>
                <Icon name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.trackList}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <MusicOptionCard
                track={item}
                isSelected={item.id === selectedTrackId}
                isPlaying={item.id === playingTrackId}
                onPress={onTrackSelect}
                variant="row"
              />
            )}
            ListEmptyComponent={
              isSearching ? (
                <ActivityIndicator size="small" color={colors.vibeCyan} style={styles.loader} />
              ) : (
                <View style={styles.emptyMusic}>
                  <Icon name="music-note-plus" size={36} color={colors.textMuted} />
                  <Text style={styles.emptyMusicTxt}>
                    {searchKeyword.length > 0 ? 'Không tìm thấy bài hát.' : 'Đang tải gợi ý nhạc...'}
                  </Text>
                </View>
              )
            }
          />

          {/* Trimmer if track is selected */}
          {selectedTrack && (
            <VibeMusicTrimmer
              startTime={startTime}
              musicDuration={musicDuration}
              currentPlayTime={currentPlayTime}
              isPlaying={playingTrackId === selectedTrack.id}
              onStartTimeChange={onStartTimeChange}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalKAV: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.modalBackdrop,
  },
  musicSheet: {
    backgroundColor: colors.cardDark,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '72%',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.overlayBorder,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgDark,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    minHeight: 48,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
  },
  trackList: {
    gap: spacing.xs,
    paddingBottom: spacing.md,
  },
  loader: {
    marginTop: spacing.lg,
  },
  emptyMusic: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  emptyMusicTxt: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
});
