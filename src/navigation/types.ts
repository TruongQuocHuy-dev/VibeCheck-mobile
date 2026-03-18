import { VibeCard } from '../features/discovery/domain/types/vibe-card.types';

export type RootStackParamList = {
  Welcome: undefined;
  OtpScreen: undefined;
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
  ChatDetail: { chatId: string; name: string; avatar: string; isOnline: boolean };
  DiscoveryDetail: { cards: VibeCard[]; initialIndex: number };
  MatchReveal: undefined;
}


export type TabParamList = {
  Discovery: undefined;
  Matches: undefined;
  Chat: undefined;
  Profile: undefined;
};
