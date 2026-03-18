import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import {
  MAX_CAPTION_LENGTH,
  vibeDefaultLocation,
  vibeDurationOptions,
  vibePreviewPhoto,
  vibeTracks,
} from '../../data/create-vibe.data';
import { VibeTrack } from '../../domain/types/create-vibe.types';

type CreateVibeNav = NativeStackNavigationProp<RootStackParamList>;

export const useCreateVibe = () => {
  const navigation = useNavigation<CreateVibeNav>();

  const [caption, setCaption] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('no-music');
  const [selectedDurationId, setSelectedDurationId] = useState<string>('duration-24h');

  const captionLength = caption.length;

  const filteredTracks = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      return vibeTracks;
    }

    return vibeTracks.filter((track) => {
      return (
        track.title.toLowerCase().includes(keyword) ||
        track.artist.toLowerCase().includes(keyword)
      );
    });
  }, [searchKeyword]);

  const selectedTrack = useMemo(() => {
    return vibeTracks.find((track) => track.id === selectedTrackId);
  }, [selectedTrackId]);

  const selectedDuration = useMemo(() => {
    return vibeDurationOptions.find((option) => option.id === selectedDurationId);
  }, [selectedDurationId]);

  const canSubmit = useMemo(() => {
    return caption.trim().length > 0 && captionLength <= MAX_CAPTION_LENGTH;
  }, [caption, captionLength]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCaptionChange = useCallback((value: string) => {
    setCaption(value.slice(0, MAX_CAPTION_LENGTH));
  }, []);

  const handleTrackSelect = useCallback((track: VibeTrack) => {
    setSelectedTrackId(track.id);
  }, []);

  const handleDurationSelect = useCallback((durationId: string) => {
    setSelectedDurationId(durationId);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) {
      return;
    }

    console.log('Create Vibe submit', {
      caption,
      selectedTrackId,
      selectedDurationId,
    });

    navigation.navigate('VibeDetail', {
      photoUrl: vibePreviewPhoto,
      caption,
      location: vibeDefaultLocation.area,
      durationLabel: selectedDuration?.label,
      trackTitle: selectedTrack?.title,
      trackArtist: selectedTrack?.artist,
    });
  }, [
    canSubmit,
    caption,
    navigation,
    selectedDuration?.label,
    selectedTrack?.artist,
    selectedTrack?.title,
    selectedDurationId,
    selectedTrackId,
  ]);

  return {
    previewPhoto: vibePreviewPhoto,
    tracks: filteredTracks,
    durations: vibeDurationOptions,
    location: vibeDefaultLocation,
    caption,
    captionLength,
    maxCaptionLength: MAX_CAPTION_LENGTH,
    selectedTrackId,
    selectedDurationId,
    selectedTrack,
    canSubmit,
    searchKeyword,
    handleClose,
    handleCaptionChange,
    handleTrackSelect,
    handleDurationSelect,
    handleSubmit,
    setSearchKeyword,
  };
};
