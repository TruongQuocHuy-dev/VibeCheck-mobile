import { useState, useEffect, useCallback } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { useToast } from '../../../../shared/hooks/useToast';
import { useLoading } from '../../../../shared/hooks/useLoading';

export interface VibeTag {
  _id: string;
  label: string;
  emoji: string;
  colorType: 'cyan' | 'pink';
}

interface VibeCardFormData {
  fullName: string;
  displayName: string;
  birthYear: number | null;
  gender: 'male' | 'female' | null;
  bio: string;
  /** Array of VibeTag _id strings selected by user */
  vibes: string[];
  avatar: string | null;
  photos: string[];
}

interface UseVibeCardEditorProps {
  onSuccess?: () => void;
}

interface UseVibeCardEditor {
  form: VibeCardFormData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  availableVibes: VibeTag[];
  isGenderLocked: boolean;
  isBirthYearLocked: boolean;
  updateField: <K extends keyof Omit<VibeCardFormData, 'photos' | 'vibes'>>(
    field: K,
    value: VibeCardFormData[K]
  ) => void;
  toggleVibe: (vibeId: string) => void;
  pickAvatar: () => Promise<void>;
  addPhoto: () => Promise<void>;
  removePhoto: (url: string) => Promise<void>;
  handleSave: () => Promise<void>;
}

export const useVibeCardEditor = (props?: UseVibeCardEditorProps): UseVibeCardEditor => {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [form, setForm] = useState<VibeCardFormData>({
    fullName: '',
    displayName: '',
    birthYear: null,
    gender: null,
    bio: '',
    vibes: [],
    avatar: null,
    photos: [],
  });
  const [availableVibes, setAvailableVibes] = useState<VibeTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenderLocked, setIsGenderLocked] = useState(false);
  const [isBirthYearLocked, setIsBirthYearLocked] = useState(false);

  // Load current profile + available vibe tags in parallel
  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, vibesRes]: [any, any] = await Promise.all([
          apiClient.get(ENDPOINTS.USER.GET_PROFILE),
          apiClient.get(ENDPOINTS.VIBES.GET_ALL),
        ]);
        const user = profileRes?.user ?? profileRes;
        
        // Lock fields if they already exist
        const hasGender = !!user.gender;
        const hasBirthYear = !!user.birthYear;
        setIsGenderLocked(hasGender);
        setIsBirthYearLocked(hasBirthYear);

        setForm({
          fullName: user.fullName ?? '',
          displayName: user.displayName ?? '',
          birthYear: user.birthYear ?? null,
          gender: user.gender ?? null,
          bio: user.bio ?? '',
          vibes: (user.vibes as any[] ?? []).map(v => typeof v === 'object' ? v._id : v),
          avatar: user.avatar ?? null,
          photos: user.photos ?? [],
        });
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
      value: VibeCardFormData[K]
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
    showLoading('Đang tải ảnh đại diện...');
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
      showToast('Cập nhật ảnh đại diện thành công', 'success');
    } catch (err: any) {
      showToast('Không tải ảnh được: ' + (err?.message ?? 'Unknown'), 'error');
    } finally {
      setSaving(false);
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const addPhoto = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    setSaving(true);
    showLoading('Đang thêm ảnh...');
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
      showToast('Thêm ảnh thành công', 'success');
    } catch (err: any) {
      showToast('Không tải ảnh được: ' + (err?.message ?? 'Unknown'), 'error');
    } finally {
      setSaving(false);
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const removePhoto = useCallback(async (url: string) => {
    setSaving(true);
    showLoading('Đang xoá ảnh...');
    try {
      await apiClient.delete(ENDPOINTS.USER.DELETE_PHOTO, { data: { photoUrl: url } });
      setForm((prev) => ({ ...prev, photos: prev.photos.filter((p) => p !== url) }));
      showToast('Đã xoá ảnh', 'success');
    } catch (err: any) {
      showToast('Không xoá ảnh được: ' + (err?.message ?? 'Unknown'), 'error');
    } finally {
      setSaving(false);
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    showLoading('Đang lưu hồ sơ...');
    try {
      // 1. Update Bio
      await apiClient.patch(ENDPOINTS.USER.UPDATE_BIO, { bio: form.bio });
      
      // 2. Update Vibes
      await apiClient.post(ENDPOINTS.USER.UPDATE_VIBES, { vibes: form.vibes });
      
      // 3. Update Names & Identity
      await apiClient.patch(ENDPOINTS.USER.UPDATE_PROFILE, {
        fullName: form.fullName,
        displayName: form.displayName,
        gender: form.gender,
        birthYear: form.birthYear,
      });

      showToast('Hồ sơ của bạn đã được cập nhật thành công!', 'success');
      if (props?.onSuccess) {
        props.onSuccess();
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Lưu thất bại.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
      hideLoading();
    }
  }, [form, props, showLoading, hideLoading, showToast]);

  return {
    form,
    loading,
    saving,
    error,
    availableVibes,
    isGenderLocked,
    isBirthYearLocked,
    updateField,
    toggleVibe,
    pickAvatar,
    addPhoto,
    removePhoto,
    handleSave,
  };
};
