export interface VibeTrack {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  previewType?: 'play';
}

export interface VibeDurationOption {
  id: string;
  label: string;
  hours: number;
}

export interface VibeLocationInfo {
  area: string;
  displayLabel: string;
  helperText: string;
}

export interface CreateVibeDraft {
  photoUrl: string;
  caption: string;
  selectedDurationId: string;
  selectedTrackId?: string;
  location: VibeLocationInfo;
}
