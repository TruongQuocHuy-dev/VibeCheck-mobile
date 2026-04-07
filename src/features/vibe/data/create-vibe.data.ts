import {
  VibeDurationOption,
} from '../domain/types/create-vibe.types';

export const MAX_CAPTION_LENGTH = 200;

export const vibeDurationOptions: VibeDurationOption[] = [
  {
    id: 'duration-24h',
    label: '24h',
    hours: 24,
  },
];
