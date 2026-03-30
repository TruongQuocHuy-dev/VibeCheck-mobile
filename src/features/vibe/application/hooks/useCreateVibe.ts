import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import axios from 'axios';
import {
  MAX_CAPTION_LENGTH,
} from '../../data/create-vibe.data';
import { VibeTrack, VibeLocationInfo } from '../../domain/types/create-vibe.types';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { PermissionsAndroid, Platform } from 'react-native';

type CreateVibeNav = NativeStackNavigationProp<RootStackParamList>;

// ─── Helpers ────────────────────────────────────────────

/** Ask for fine-location permission on Android */
const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Quyền vị trí',
        message: 'VibeCheck cần biết vị trí của bạn để gắn vào Vibe.',
        buttonPositive: 'Cho phép',
        buttonNegative: 'Từ chối',
      },
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
};

/** Get coords then reverse-geocode via Nominatim (OpenStreetMap, free, no API key) */
const fetchRealLocation = (): Promise<VibeLocationInfo | null> =>
  new Promise((resolve) => {
    const fallback: VibeLocationInfo = {
      area: 'Vị trí của bạn',
      displayLabel: 'Đang ở',
      helperText: '',
    };

    // React Native exposes navigator.geolocation as a global via its polyfill
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geo = ((globalThis as any).navigator?.geolocation) as any;
    if (!geo) {
      resolve(null);
      return;
    }

    geo.getCurrentPosition(
      async (position: any) => {
        const coords = position.coords;
        try {
          const url =
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}` +
            `&lon=${coords.longitude}&format=json&accept-language=vi`;

          const res = await fetch(url, {
            headers: { 'User-Agent': 'VibeCheck/1.0' },
          });
          const data = await res.json();

          const addr = data.address ?? {};
          const area =
            addr.suburb ??
            addr.neighbourhood ??
            addr.city_district ??
            addr.city ??
            addr.town ??
            addr.county ??
            addr.state ??
            'Vị trí của bạn';

          resolve({
            area,
            displayLabel: 'Đang ở',
            helperText: 'Chỉ hiển thị khu vực',
          });
        } catch {
          resolve(null);
        }
      },
      () => resolve(null),
      { timeout: 8000, maximumAge: 60_000, enableHighAccuracy: false },
    );
  });

// ────────────────────────────────────────────────────────

type ShowToast = (message: string, type?: 'success' | 'error' | 'info', durationMs?: number) => void;

export const useCreateVibe = (showToast?: ShowToast) => {
  const navigation = useNavigation<CreateVibeNav>();

  const [caption, setCaption] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('no-music');
  const [selectedDurationId, setSelectedDurationId] = useState<string>('duration-24h');

  const [imageAsset, setImageAsset] = useState<Asset | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itunesTracks, setItunesTracks] = useState<VibeTrack[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [hasLoadedDefaults, setHasLoadedDefaults] = useState(false);

  /** Fetch popular songs if no search is active */
  const fetchDefaultTracks = useCallback(async () => {
    if (hasLoadedDefaults) return;
    setIsSearchingMusic(true);
    try {
      const response = await axios.get(
        'https://itunes.apple.com/search?term=pop&entity=song&limit=15',
      );
      const results = response.data.results ?? [];
      const mapped: VibeTrack[] = results.map((item: any) => ({
        id: String(item.trackId),
        title: item.trackName,
        artist: item.artistName,
        coverUrl: item.artworkUrl100,
        previewUrl: item.previewUrl,
      }));
      setItunesTracks(mapped);
      setHasLoadedDefaults(true);
    } catch (err) {
      console.error('[useCreateVibe] Default music error:', err);
    } finally {
      setIsSearchingMusic(false);
    }
  }, [hasLoadedDefaults]);

  useEffect(() => {
    fetchDefaultTracks();
  }, [fetchDefaultTracks]);
  const [startTime, setStartTime] = useState(0); // giây bắt đầu (0-10)
  const [vibeMode, setVibeMode] = useState<'photo' | 'text'>('photo');
  const musicDuration = 20; // cố định 20s nếu có nhạc

  // Location
  const [locationInfo, setLocationInfo] = useState<VibeLocationInfo | null>(null);

  // UI filter state
  const [intensity] = useState(0.6);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);

  const captionLength = caption.length;

  // ── Fetch real location on mount ──
  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) {
        setLocationInfo(null);
        return;
      }
      const info = await fetchRealLocation();
      setLocationInfo(info);
    })();
  }, []);

  // ── iTunes search (debounced) ──
  useEffect(() => {
    const timer = setTimeout(async () => {
      const keyword = searchKeyword.trim().toLowerCase();
      if (!keyword) {
        if (hasLoadedDefaults) return; // keep defaults when clearing search
        return;
      }
      setIsSearchingMusic(true);
      try {
        const response = await axios.get(
          `https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&entity=song&limit=15`,
        );
        const results = response.data.results ?? [];
        const mapped: VibeTrack[] = results.map((item: any) => ({
          id: String(item.trackId),
          title: item.trackName,
          artist: item.artistName,
          coverUrl: item.artworkUrl100,
          previewUrl: item.previewUrl,
        }));
        setItunesTracks(mapped);
      } catch (err) {
        console.error('[useCreateVibe] iTunes search error:', err);
      } finally {
        setIsSearchingMusic(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKeyword, hasLoadedDefaults]);

  const selectedTrack = useMemo(
    () => itunesTracks.find((t) => t.id === selectedTrackId) ?? null,
    [itunesTracks, selectedTrackId],
  );

  const playingTrackUrl = useMemo(
    () => itunesTracks.find((t) => t.id === playingTrackId)?.previewUrl,
    [itunesTracks, playingTrackId],
  );

  // canSubmit: allows submission if there is an image OR a caption
  const canSubmit = useMemo(
    () => (!!imageAsset || caption.trim().length > 0) && !isSubmitting && captionLength <= MAX_CAPTION_LENGTH,
    [imageAsset, caption, isSubmitting, captionLength],
  );

  // ── Handlers ──

  const handleClose = useCallback(() => navigation.goBack(), [navigation]);

  const handlePickImage = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets.length > 0) {
      setImageAsset(result.assets[0]);
    }
  }, []);

  /**
   * Called by the screen after react-native-vision-camera captures a photo.
   * Converts PhotoFile.path → Asset-compatible object so handleSubmit can upload it.
   */
  const handleCapturedPhoto = useCallback((photoPath: string) => {
    const uri = photoPath.startsWith('file://') ? photoPath : `file://${photoPath}`;
    setImageAsset({
      uri,
      fileName: `vibe_${Date.now()}.jpg`,
      type: 'image/jpeg',
      fileSize: 0,
      width: 0,
      height: 0,
    } as Asset);
  }, []);

  const handleCaptionChange = useCallback((value: string) => {
    setCaption(value.slice(0, MAX_CAPTION_LENGTH));
  }, []);

  const handleTrackSelect = useCallback((track: VibeTrack) => {
    setSelectedTrackId(track.id);
    setStartTime(0); // reset khi đổi bài
    setPlayingTrackId((prev) => (prev === track.id ? null : track.id));
  }, []);

  const handleStopPreview = useCallback(() => {
    setPlayingTrackId(null);
  }, []);

  const switchMode = useCallback((mode: 'photo' | 'text') => {
    setVibeMode(mode);
    if (mode === 'text') {
      // Clear any captured/picked photo when switching to text-only mode
      setImageAsset(null);
    }
  }, []);

  const applyFilter = useCallback((filterId: string) => {
    setActiveFilterId((prev) => (prev === filterId ? null : filterId));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!imageAsset?.uri && (!caption || caption.trim() === '')) {
      showToast?.('Vui lòng chụp hoặc chọn ảnh, hoặc nhập nội dung để đăng Vibe.', 'error');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption.trim());
      
      if (imageAsset) {
        formData.append('image', {
          uri: imageAsset.uri,
          name: imageAsset.fileName ?? 'vibe.jpg',
          type: imageAsset.type ?? 'image/jpeg',
        } as any);
      }

      if (selectedTrack) {
        formData.append(
          'musicStr',
          JSON.stringify({
            title: selectedTrack.title,
            artist: selectedTrack.artist,
            coverUrl: selectedTrack.coverUrl,
            previewUrl: selectedTrack.previewUrl,
            startTime,
            musicDuration,
          }),
        );
      }

      if (locationInfo && locationInfo.area) {
        formData.append(
          'locationStr',
          JSON.stringify({
            area: locationInfo.area,
            displayLabel: locationInfo.displayLabel,
          }),
        );
      }

      // Xác định thời lượng story hiển thị: 20s (có nhạc) hoặc 15s (ko nhạc)
      formData.append('displayDuration', (selectedTrack ? musicDuration : 15).toString());

      await apiClient.post(ENDPOINTS.VIBE_STORIES.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast?.('Vibe của bạn đã được đăng thành công! 🎉', 'success', 3000);
      navigation.goBack();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        'Không thể đăng Vibe ngay lúc này.';
      showToast?.(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [imageAsset, isSubmitting, caption, selectedTrack, navigation, showToast, startTime, musicDuration, locationInfo]);

  return {
    previewPhoto: imageAsset?.uri,
    hasImage: !!imageAsset,
    tracks: itunesTracks,
    location: locationInfo,
    caption,
    captionLength,
    maxCaptionLength: MAX_CAPTION_LENGTH,
    selectedTrackId,
    selectedDurationId,
    selectedTrack,
    canSubmit,
    isSubmitting,
    isSearchingMusic,
    searchKeyword,
    playingTrackId,
    playingTrackUrl,
    intensity,
    activeFilterId,
    startTime,
    musicDuration,
    setStartTime,
    handleClose,
    handlePickImage,
    handleCapturedPhoto,
    handleCaptionChange,
    handleTrackSelect,
    handleStopPreview,
    handleSubmit,
    vibeMode,
    switchMode,
    fetchDefaultTracks,
    applyFilter,
    setSearchKeyword,
  };
};
