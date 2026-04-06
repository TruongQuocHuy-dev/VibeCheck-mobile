import type { Candidate, DiscoveryFilters } from '../features/discovery/domain/types/vibe-card.types';

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
    userId: string;
    stories: any[];
    initialIndex?: number;
    userName?: string;
    userAvatar?: string;
  };
  MatchProfile: {
    id: string;
    name: string;
    age: number;
    avatar: string;
    conversationId?: string;
    isOnline?: boolean;
  };
  ChatDetail: { conversationId: string; name: string; avatar: string | null; isOnline: boolean; otherUserId: string; lastActive?: string | null; blockedByMe?: boolean };
  ChatInfo: { conversationId: string; userId: string; name: string; avatar: string | null; bio?: string | null; blockedByMe?: boolean };
  DiscoveryDetail: { candidates: Candidate[]; initialIndex: number; filters?: DiscoveryFilters };
  MatchReveal: {
    matchedUserName: string;
    matchedUserAvatar: string | null;
    conversationId: string;
    myAvatar?: string | null;
  };
  Feed: undefined;
  VibeCardEditor: undefined;
  ChangePassword: undefined;
  BlockedList: undefined;
  SupportContact: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
}



export type TabParamList = {
  Discovery: undefined;
  Matches: undefined;
  Chat: undefined;
  Profile: undefined;
};
