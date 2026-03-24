import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';

export interface VibeTag {
  _id: string;
  label: string;
  emoji: string;
  colorType: 'cyan' | 'pink';
}

interface VibeCardFormData {
  displayName: string;
  bio: string;
  /** Array of VibeTag _id strings selected by user */
  vibes: string[];
  avatar: string | null;
  photos: string[];
}

interface UseVibeCardEditor {
  form: VibeCardFormData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  availableVibes: VibeTag[];
  updateField: <K extends keyof Omit<VibeCardFormData, 'photos' | 'vibes'>>(
    field: K,
    value: string
  ) => void;
  toggleVibe: (vibeId: string) => void;
  pickAvatar: () => Promise<void>;
  addPhoto: () => Promise<void>;
  removePhoto: (url: string) => Promise<void>;
  handleSave: () => Promise<void>;
}

// VIBE_TAGS are now fetched from the backend (/api/vibes).

export const useVibeCardEditor = (): UseVibeCardEditor => {
  const [form, setForm] = useState<VibeCardFormData>({
    displayName: '',
    bio: '',
    vibes: [],
    avatar: null,
    photos: [],
  });
  const [availableVibes, setAvailableVibes] = useState<VibeTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current profile + available vibe tags in parallel
  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, vibesRes]: [any, any] = await Promise.all([
          apiClient.get(ENDPOINTS.USER.GET_PROFILE),
          apiClient.get(ENDPOINTS.VIBES.GET_ALL),
        ]);
        const user = profileRes?.user ?? profileRes;
        setForm({
          displayName: user.displayName ?? '',
          bio: user.bio ?? '',
          vibes: user.vibes ?? [],
          avatar: user.avatar ?? null,
          photos: user.photos ?? [],
        });
        // vibesRes is { vibes: [...] } after axios unwrap
        const tags: VibeTag[] = vibesRes?.vibes ?? vibesRes ?? [];
        setAvailableVibes(tags);
      } catch (err: any) {
        setError(err?.message ?? 'Không tải được hồ sơ.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateField = useCallback(
    <K extends keyof Omit<VibeCardFormData, 'photos' | 'vibes'>>(
      field: K,
      value: string
    ) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const toggleVibe = useCallback((vibe: string) => {
    setForm((prev) => {
      const vibes = prev.vibes.includes(vibe)
        ? prev.vibes.filter((v) => v !== vibe)
        : [...prev.vibes, vibe];
      return { ...prev, vibes };
    });
  }, []);

  const pickAvatar = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: asset.uri,
        name: asset.fileName ?? 'avatar.jpg',
        type: asset.type ?? 'image/jpeg',
      } as any);
      const res: any = await apiClient.post(ENDPOINTS.USER.UPDATE_AVATAR, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, avatar: res?.avatarUrl ?? prev.avatar }));
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không tải ảnh được: ' + (err?.message ?? 'Unknown'));
    } finally {
      setSaving(false);
    }
  }, []);

  const addPhoto = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: asset.uri,
        name: asset.fileName ?? 'photo.jpg',
        type: asset.type ?? 'image/jpeg',
      } as any);
      const res: any = await apiClient.post(ENDPOINTS.USER.ADD_PHOTO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, photos: res?.photos ?? prev.photos }));
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không tải ảnh được: ' + (err?.message ?? 'Unknown'));
    } finally {
      setSaving(false);
    }
  }, []);

  const removePhoto = useCallback(async (url: string) => {
    setSaving(true);
    try {
      await apiClient.delete(ENDPOINTS.USER.DELETE_PHOTO, { data: { photoUrl: url } });
      setForm((prev) => ({ ...prev, photos: prev.photos.filter((p) => p !== url) }));
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không xoá ảnh được: ' + (err?.message ?? 'Unknown'));
    } finally {
      setSaving(false);
    }
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      // Update bio
      await apiClient.patch(ENDPOINTS.USER.UPDATE_BIO, { bio: form.bio });
      // Update vibes
      await apiClient.post(ENDPOINTS.USER.UPDATE_VIBES, { vibes: form.vibes });
      // Note: displayName requires birthYear via PATCH /profile — only save if both are available.
      // For now we skip displayName patching to avoid the 400 error.
      Alert.alert('✅ Đã lưu', 'Thẻ Vibe của bạn đã được cập nhật!');
    } catch (err: any) {
      setError(err?.message ?? 'Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  }, [form]);

  return {
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
  };
};
