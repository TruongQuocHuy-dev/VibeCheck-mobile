import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from '../components/navigation/CustomTabBar';
import { DiscoveryScreen } from '../features/discovery/presentation/screens/DiscoveryScreen';
import { MatchesScreen } from '../features/matches/presentation/screens/MatchesScreen';
import { ChatScreen } from '../features/chat/presentation/screens/ChatScreen';
import { ProfileScreen } from '../features/profile/presentation/screens/ProfileScreen';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Discovery" component={DiscoveryScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
