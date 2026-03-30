export interface VibeTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  previewUrl?: string;
  startTime?: number; // offset in seconds (0-10)
  musicDuration?: number; // segment length in seconds (default 20)
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
  startTime?: number;
  musicDuration?: number;
}
