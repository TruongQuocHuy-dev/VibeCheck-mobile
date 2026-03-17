import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../../constants/colors';
import { spacing } from '../../../../constants/spacing';

const { width } = Dimensions.get('window');

import { VibePickerScreenProps, VibeTag as VibeTagType } from '../../domain/types/vibe-picker.types';
import { useVibePicker } from '../../application/hooks/useVibePicker';
import { VIBE_TAGS } from '../../data/vibe.data';

// Local Sub-Component: VibeHeader
const VibeHeader: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>
      
      <View style={styles.headerTitleWrapper}>
        <Text style={styles.title}>Vibe thường ngày</Text>
        <Text style={styles.title}>của bạn?</Text>
        <Text style={styles.subtitle}>Chọn 3-5 vibe để dễ match hơn</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack} />
        <View style={[styles.progressTrack, styles.progressActive]} />
        <View style={styles.progressTrack} />
      </View>
    </View>
  );
};

// Local Sub-Component: VibeTagItem
const VibeTagItem: React.FC<{ tag: VibeTagType; isSelected: boolean; onToggle: (id: string) => void }> = ({ tag, isSelected, onToggle }) => {
  const isCyan = tag.colorType === 'cyan';
  const tagStyle = isSelected ? (isCyan ? styles.tagSelectedCyan : styles.tagSelectedPink) : styles.tagNormal;

  return (
    <TouchableOpacity onPress={() => onToggle(tag.id)} activeOpacity={0.8} style={[styles.tagBase, tagStyle]}>
      <Text style={[styles.emoji, !isSelected && styles.emojiNormal]}>{tag.emoji}</Text>
      <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{tag.label}</Text>
    </TouchableOpacity>
  );
};

export const VibePickerScreen: React.FC<VibePickerScreenProps> = ({ onComplete, onBack }) => {
  const { selectedIds, toggleSelection, handleReset, isValid, handleSubmit } = useVibePicker(onComplete);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Background Glows */}
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />

      <VibeHeader onBack={onBack} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tagsWrapper}>
          {VIBE_TAGS.map((tag) => (
            <VibeTagItem 
              key={tag.id}
              tag={tag}
              isSelected={selectedIds.includes(tag.id)}
              onToggle={toggleSelection}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.lg }]}>
        <View style={styles.counterRow}>
          <Text style={styles.counterText}>ĐÃ CHỌN {selectedIds.length}/5</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitButtonWrapper}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <LinearGradient
            colors={isValid ? [colors.neonCyan || '#00F0FF', '#0099FF'] : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.submitButton, isValid && styles.buttonShadowCyan]}
          >
            <Text style={[styles.submitButtonText, !isValid && styles.textMuted]}>VÀO RADAR NÀO!</Text>
            <Icon name="radar" size={24} color={isValid ? '#000000' : 'rgba(255,255,255,0.2)'} style={{ marginLeft: 6 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgBlack },
  glow: { position: 'absolute', borderRadius: 999, opacity: 0.15 },
  glowTop: { top: -100, right: -100, width: 400, height: 400, backgroundColor: colors.primaryPink, opacity: 0.12 },
  glowBottom: { bottom: -80, left: -80, width: 350, height: 350, backgroundColor: colors.neonCyan, opacity: 0.1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: 40 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgTooltip, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  headerTitleWrapper: { marginBottom: 24 },
  title: { fontSize: 30, fontWeight: '800', color: colors.white, lineHeight: 36 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 8, fontWeight: '500' },
  progressContainer: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  progressTrack: { height: 4, flex: 1, backgroundColor: colors.borderLight, borderRadius: 2 },
  progressActive: { backgroundColor: colors.neonCyan, shadowColor: colors.neonCyan, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 3 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  tagsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tagBase: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999, borderWidth: 1, gap: 8 },
  tagNormal: { backgroundColor: colors.bgTooltip, borderColor: colors.borderLight },
  tagSelectedCyan: { backgroundColor: colors.cyanBg, borderColor: colors.neonCyan, shadowColor: colors.neonCyan, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  tagSelectedPink: { backgroundColor: colors.pinkBg, borderColor: colors.neonPink, shadowColor: colors.neonPink, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  emoji: { fontSize: 18 },
  emojiNormal: { opacity: 0.6 },
  tagText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  tagTextSelected: { color: colors.white, fontWeight: '600' },
  statusWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomSection: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: 10, backgroundColor: colors.bgBlack },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  counterText: { fontSize: 12, fontWeight: '700', color: colors.neonCyan, letterSpacing: 1.2 },
  resetText: { fontSize: 12, color: '#707070', fontWeight: '600' },
  submitButtonWrapper: { width: '100%' },
  submitButton: { height: 56, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonShadowCyan: { shadowColor: colors.neonCyan, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 12, elevation: 6 },
  submitButtonText: { fontSize: 16, fontWeight: '900', color: '#000000', letterSpacing: 0.5 },
  textMuted: { color: 'rgba(255,255,255,0.3)' }
});
