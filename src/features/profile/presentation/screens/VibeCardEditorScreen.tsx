import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useVibeCardEditor, type VibeTag } from '../../application/hooks/useVibeCardEditor';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius } from '../../../../core/theme/spacing';
import { typography } from '../../../../core/theme';

export const VibeCardEditorScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    form,
    loading,
    saving,
    error,
    availableVibes,
    updateField,
    toggleVibe,
    pickAvatar,
    addPhoto,
    removePhoto,
    handleSave,
  } = useVibeCardEditor();

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ActivityIndicator size="large" color={colors.neonCyan} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa thẻ Vibe</Text>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Banner */}
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* ── Avatar Section ── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickAvatar} disabled={saving}>
            <View style={styles.avatarWrapper}>
              {form.avatar ? (
                <Image source={{ uri: form.avatar }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                  <Icon name="camera" size={40} color={colors.textOpacity60} />
                </View>
              )}
              <View style={styles.avatarEditBadge}>
                <Icon name="camera" size={16} color={colors.white} />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Nhấn để đổi ảnh đại diện</Text>
        </View>

        {/* ── Full Name ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Họ và tên thật</Text>
          <Text style={styles.sublabel}>Tên này hiển thị ở màn hình Match và Chat</Text>
          <TextInput
            style={styles.input}
            value={form.fullName}
            onChangeText={(v) => updateField('fullName', v)}
            placeholder="Ví dụ: Nguyễn Văn A"
            placeholderTextColor={colors.textOpacity60}
            maxLength={50}
          />
        </View>

        {/* ── Display Name ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Tên hiển thị</Text>
          <TextInput
            style={styles.input}
            value={form.displayName}
            onChangeText={(v) => updateField('displayName', v)}
            placeholder="Nhập tên của bạn..."
            placeholderTextColor={colors.textOpacity60}
            maxLength={30}
          />
        </View>

        {/* ── Bio ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={form.bio}
            onChangeText={(v) => updateField('bio', v)}
            placeholder="Giới thiệu bản thân, sở thích, vibe của bạn..."
            placeholderTextColor={colors.textOpacity60}
            multiline
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{form.bio.length}/200</Text>
        </View>

        {/* ── Vibe Tags ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Vibe Tags</Text>
          <Text style={styles.sublabel}>Chọn tối đa 5 vibe mô tả bạn nhất</Text>
          <View style={styles.vibeGrid}>
            {availableVibes.map((vibe: VibeTag) => {
              const selected = form.vibes.includes(vibe._id);
              const maxReached = form.vibes.length >= 5 && !selected;
              return (
                <TouchableOpacity
                  key={vibe._id}
                  style={[
                    styles.vibePill,
                    selected && styles.vibePillSelected,
                    maxReached && styles.vibePillDisabled,
                  ]}
                  onPress={() => !maxReached && toggleVibe(vibe._id)}
                  disabled={maxReached}
                >
                  <Text style={[
                    styles.vibePillText,
                    selected && styles.vibePillTextSelected,
                    maxReached && styles.vibePillTextDisabled,
                  ]}>
                    {vibe.emoji} {vibe.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Extra Photos ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Ảnh thêm</Text>
          <Text style={styles.sublabel}>Thêm ảnh để card detail của bạn thêm hấp dẫn</Text>

          <View style={styles.photosGrid}>
            {form.photos.map((uri) => (
              <View key={uri} style={styles.photoItem}>
                <Image source={{ uri }} style={styles.photoThumb} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.photoDelete}
                  onPress={() => removePhoto(uri)}
                  disabled={saving}
                >
                  <Icon name="close-circle" size={22} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}

            {form.photos.length < 6 && (
              <TouchableOpacity style={styles.addPhotoBtn} onPress={addPhoto} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color={colors.neonCyan} />
                ) : (
                  <>
                    <Icon name="add" size={32} color={colors.neonCyan} />
                    <Text style={styles.addPhotoText}>Thêm ảnh</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Preview CTA ── */}
        <View style={styles.previewBanner}>
          <Icon name="eye-outline" size={20} color={colors.neonCyan} />
          <Text style={styles.previewText}>
            Đây là thông tin người khác thấy khi quẹt thẻ của bạn.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.overlayBorder,
  },
  backBtn: { padding: spacing.xs },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: colors.neonCyan,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    minWidth: 60,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: colors.bgDark, fontWeight: '700', fontSize: typography.sizes.sm },
  content: { padding: spacing.lg, gap: spacing.xl },
  errorBanner: {
    backgroundColor: colors.error,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  errorText: { color: colors.white, fontSize: typography.sizes.sm },

  // Avatar
  avatarSection: { alignItems: 'center', gap: spacing.sm },
  avatarWrapper: { position: 'relative' },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.neonPink,
  },
  avatarPlaceholder: {
    backgroundColor: colors.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.neonPink,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.bgDark,
  },
  avatarHint: { color: colors.textOpacity60, fontSize: typography.sizes.xs },

  // Fields
  fieldGroup: { gap: spacing.sm },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.textOpacity60,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  sublabel: { fontSize: typography.sizes.xs, color: colors.textOpacity60, marginTop: -4 },
  input: {
    backgroundColor: colors.overlayLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
  },
  bioInput: { minHeight: 100 },
  charCount: {
    fontSize: typography.sizes.xs,
    color: colors.textOpacity60,
    textAlign: 'right',
    marginTop: -4,
  },

  // Vibe grid
  vibeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  vibePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.overlayBorder,
    backgroundColor: colors.overlayLight,
  },
  vibePillSelected: {
    backgroundColor: colors.cyanBg,
    borderColor: colors.neonCyan,
  },
  vibePillDisabled: { opacity: 0.35 },
  vibePillText: { color: colors.textSecondary, fontSize: typography.sizes.sm },
  vibePillTextSelected: { color: colors.neonCyan, fontWeight: '600' },
  vibePillTextDisabled: { color: colors.textOpacity60 },

  // Photos
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  photoItem: { position: 'relative' },
  photoThumb: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.overlayLight,
  },
  photoDelete: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.bgDark,
    borderRadius: 12,
  },
  addPhotoBtn: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.neonCyan,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoText: { color: colors.neonCyan, fontSize: typography.sizes.xs, fontWeight: '600' },

  // Preview banner
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.cyanBg,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.cyanBorder,
  },
  previewText: { color: colors.neonCyan, fontSize: typography.sizes.sm, flex: 1, lineHeight: 20 },
});
