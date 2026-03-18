export type ReactionKind = 'heart' | 'fire';

export interface VibeTrackInfo {
  title: string;
  artist: string;
}

export interface VibeStat {
  id: string;
  label: string;
  value: number;
  accent?: 'primary' | 'secondary';
}

export interface VibeReactionUser {
  id: string;
  avatar: string;
  reaction: ReactionKind;
  ring?: 'primary' | 'secondary' | 'neutral';
}

export interface VibeComment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  timeAgo: string;
}

export interface VibeDetailData {
  id: string;
  caption: string;
  location: string;
  expiresIn: string;
  backgroundImage: string;
  track: VibeTrackInfo;
  stats: VibeStat[];
  reactions: VibeReactionUser[];
  comments: VibeComment[];
  viewerBlurAvatars: string[];
}

export type CommentFilter = 'latest' | 'top';
