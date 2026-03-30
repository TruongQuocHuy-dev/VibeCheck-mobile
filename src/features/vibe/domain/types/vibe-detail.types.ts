export type ReactionKind = 'heart' | 'fire' | 'wow' | 'laugh';

export interface VibeTrackInfo {
  id?: string;
  title: string;
  artist: string;
  previewUrl?: string;
  artwork?: string;
  startTime?: number;
  musicDuration?: number;
}

export interface VibeLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
  area?: string;
}

export interface VibeStory {
  id: string;
  _id?: string;
  imageUrl?: string;
  backgroundImage?: string;
  caption?: string;
  location?: string | VibeLocation;
  music?: VibeTrackInfo;
  expiresAt: string | Date;
  ownerName?: string;
  ownerAvatar?: string;
  createdAt: string;
}

export interface VibeInteraction {
  _id: string;
  sender: {
    _id: string;
    id?: string;
    fullName: string;
    displayName?: string;
    avatar: string;
  };
  latestReply?: string;
  reactions?: string[];
  lastActive: string;
}

export interface VibeDetailData {
  id: string;
  caption: string;
  location: string | VibeLocation | null;
  expiresAt: string | Date;
  backgroundImage: string;
  track: VibeTrackInfo | null;
  ownerName: string;
  ownerAvatar: string;
  stats?: any[];
  reactions?: any[];
  comments?: any[];
}
