import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
export { CustomTabBar } from './CustomTabBar';
export { CreateVibeFAB } from './CreateVibeFAB';

// Main Tab Routes
export type MainTabParamList = {
  Discovery: undefined;
  Matches: undefined;
  Chat: undefined;
  Profile: undefined;
};

// Root Stack Routes (includes tabs + modals)
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  CreateVibe: undefined;
  UserProfile: { userId: string };
  ChatDetail: { matchId: string; userId: string; userName: string };
  MatchReveal: { matchId: string; userId: string };
  Settings: undefined;
  Premium: undefined;
};

// Type helpers for screens
export type DiscoveryScreenProps = BottomTabScreenProps<MainTabParamList, 'Discovery'>;
export type MatchesScreenProps = BottomTabScreenProps<MainTabParamList, 'Matches'>;
export type ChatScreenProps = BottomTabScreenProps<MainTabParamList, 'Chat'>;
export type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

// Navigation prop types
export type DiscoveryNavigationProp = DiscoveryScreenProps['navigation'];
export type MatchesNavigationProp = MatchesScreenProps['navigation'];
export type ChatNavigationProp = ChatScreenProps['navigation'];
export type ProfileNavigationProp = ProfileScreenProps['navigation'];