import { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import axios from 'axios';
import {
  MAX_CAPTION_LENGTH,
  vibeDefaultLocation,
  vibeDurationOptions,
} from '../../data/create-vibe.data';
import { VibeTrack } from '../../domain/types/create-vibe.types';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { Alert } from 'react-native';

type CreateVibeNav = NativeStackNavigationProp<RootStackParamList>;

export const useCreateVibe = () => {
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

  const captionLength = caption.length;

  useEffect(() => {
    // Basic debounce for iTunes search
    const delayDebounceFn = setTimeout(async () => {
      const keyword = searchKeyword.trim().toLowerCase();
      if (!keyword) {
        setItunesTracks([]);
        return;
      }

      setIsSearchingMusic(true);
      try {
        const response = await axios.get(
          `https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&entity=song&limit=15`
        );
        const results = response.data.results || [];
        const mappedTracks: VibeTrack[] = results.map((item: any) => ({
          id: String(item.trackId),
          title: item.trackName,
          artist: item.artistName,
          coverUrl: item.artworkUrl100,
          previewUrl: item.previewUrl,
        }));
        setItunesTracks(mappedTracks);
      } catch (err) {
        console.error('iTunes API Error:', err);
      } finally {
        setIsSearchingMusic(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchKeyword]);

  const selectedTrack = useMemo(() => {
    return itunesTracks.find((track) => track.id === selectedTrackId) || null;
  }, [itunesTracks, selectedTrackId]);

  const selectedDuration = useMemo(() => {
    return vibeDurationOptions.find((option) => option.id === selectedDurationId);
  }, [selectedDurationId]);

  const playingTrackUrl = useMemo(() => {
    return itunesTracks.find(t => t.id === playingTrackId)?.previewUrl;
  }, [itunesTracks, playingTrackId]);

  const canSubmit = useMemo(() => {
    return !!imageAsset && !isSubmitting && captionLength <= MAX_CAPTION_LENGTH;
  }, [imageAsset, isSubmitting, captionLength]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePickImage = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets.length > 0) {
      setImageAsset(result.assets[0]);
    }
  }, []);

  const handleCaptionChange = useCallback((value: string) => {
    setCaption(value.slice(0, MAX_CAPTION_LENGTH));
  }, []);

  const handleTrackSelect = useCallback((track: VibeTrack) => {
    setSelectedTrackId(track.id);
    if (track.previewUrl) {
      setPlayingTrackId(track.id);
    } else {
      setPlayingTrackId(null);
    }
  }, []);

  const handleDurationSelect = useCallback((durationId: string) => {
    setSelectedDurationId(durationId);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !imageAsset?.uri) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption.trim());
      
      formData.append('image', {
        uri: imageAsset.uri,
        name: imageAsset.fileName ?? 'vibe.jpg',
        type: imageAsset.type ?? 'image/jpeg',
      } as any);

      if (selectedTrack) {
        formData.append('musicStr', JSON.stringify({
          title: selectedTrack.title,
          artist: selectedTrack.artist,
          coverUrl: selectedTrack.coverUrl,
          previewUrl: selectedTrack.previewUrl,
        }));
      }

      await apiClient.post(ENDPOINTS.VIBE_STORIES.CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Thành công', 'Vibe của bạn đã được đăng thành công!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể đăng Vibe ngay lúc này.');
    } finally {
      setIsSubmitting(false);
    }
  }, [canSubmit, imageAsset, caption, selectedTrack, navigation]);

  return {
    previewPhoto: imageAsset?.uri,
    tracks: itunesTracks,
    durations: vibeDurationOptions,
    location: vibeDefaultLocation,
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
    handleClose,
    handlePickImage,
    handleCaptionChange,
    handleTrackSelect,
    handleDurationSelect,
    handleSubmit,
    setSearchKeyword,
    playingTrackUrl,
  };
};
