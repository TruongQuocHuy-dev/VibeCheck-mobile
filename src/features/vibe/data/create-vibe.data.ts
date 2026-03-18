import {
  VibeDurationOption,
  VibeLocationInfo,
  VibeTrack,
} from '../domain/types/create-vibe.types';

export const MAX_CAPTION_LENGTH = 300;

export const vibePreviewPhoto =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80';

export const vibeTracks: VibeTrack[] = [
  {
    id: 'no-music',
    title: 'Trống',
    artist: '',
    artwork: '',
  },
  {
    id: 'track-vibe-check',
    title: 'Vibe Check',
    artist: 'GenZ Flow',
    artwork:
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=400&q=80',
    previewType: 'play',
  },
  {
    id: 'track-midnight-city',
    title: 'Midnight City',
    artist: 'M83',
    artwork:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'track-starboy',
    title: 'Starboy',
    artist: 'The Weeknd',
    artwork:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
  },
];

export const vibeDurationOptions: VibeDurationOption[] = [
  {
    id: 'duration-12h',
    label: '12h',
    hours: 12,
  },
  {
    id: 'duration-24h',
    label: '24h',
    hours: 24,
  },
  {
    id: 'duration-48h',
    label: '48h',
    hours: 48,
  },
];

export const vibeDefaultLocation: VibeLocationInfo = {
  area: 'Thư viện Bách Khoa',
  displayLabel: 'Đang ở',
  helperText: 'Chỉ hiển thị khu vực, không hiển thị chính xác',
};
