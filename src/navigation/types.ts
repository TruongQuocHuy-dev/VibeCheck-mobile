import { VibeCard } from '../features/discovery/domain/types/vibe-card.types';

export type RootStackParamList = {
  Welcome: undefined;
  OtpScreen: undefined;
  ProfileSetup: undefined;
  VibePicker: undefined;
  Main: undefined;
  ChatDetail: { chatId: string; name: string; avatar: string; isOnline: boolean };
  DiscoveryDetail: { cards: VibeCard[]; initialIndex: number };
}


export type TabParamList = {
  Discovery: undefined;
  Matches: undefined;
  Chat: undefined;
  Profile: undefined;
};
