import type { Candidate } from '../features/discovery/domain/types/vibe-card.types';

export type RootStackParamList = {
  Welcome: undefined;
  OtpScreen: undefined;
  CreatePassword: undefined;
  ProfileSetup: undefined;
  VibePicker: undefined;
  Main: undefined;
  Settings: undefined;
  Notifications: undefined;
  CreateVibe: undefined;
  VibeDetail: {
    photoUrl?: string;
    caption?: string;
    location?: string;
    durationLabel?: string;
    trackTitle?: string;
    trackArtist?: string;
    ownerName?: string;
    ownerAvatar?: string;
    fromMatchStory?: boolean;
  } | undefined;
  MatchProfile: {
    id: string;
    name: string;
    age: number;
    avatar: string;
    isOnline?: boolean;
  };
  ChatDetail: { conversationId: string; name: string; avatar: string | null; isOnline: boolean };
  DiscoveryDetail: { candidates: Candidate[]; initialIndex: number };
  MatchReveal: {
    matchedUserName: string;
    matchedUserAvatar: string | null;
    conversationId: string;
    myAvatar?: string | null;
  };
  Feed: undefined;
  VibeCardEditor: undefined;
}



export type TabParamList = {
  Discovery: undefined;
  Matches: undefined;
  Chat: undefined;
  Profile: undefined;
};
