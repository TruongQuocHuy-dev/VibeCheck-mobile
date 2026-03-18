import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../features/auth/presentation/screens/WelcomeScreen';
import { OtpScreen } from '../features/auth/presentation/screens/OtpScreen';
import { ProfileSetupScreen } from '../features/auth/presentation/screens/ProfileSetupScreen';
import { VibePickerScreen } from '../features/auth/presentation/screens/VibePickerScreen';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';
import { ChatDetailScreen } from '../features/chat/presentation/screens/ChatDetailScreen';
import { DiscoveryDetailScreen } from '../features/discovery/presentation/screens/DiscoveryDetailScreen';
import { MatchRevealScreen } from '../features/discovery/presentation/screens/MatchRevealScreen';
import { NotificationsScreen } from '../features/notifications/presentation/screens/NotificationsScreen';
import { ProfileScreen } from '../features/profile/presentation/screens/ProfileScreen';
import { SettingsScreen } from '../features/profile/presentation/screens/SettingsScreen';
import { CreateVibeScreen } from '../features/vibe/presentation/screens/CreateVibeScreen';
import { VibeDetailScreen } from '../features/vibe/presentation/screens/VibeDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Default to true for testing purposes

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="OtpScreen">
            {props => (
              <OtpScreen 
                {...props} 
                onLoginSuccess={() => props.navigation.navigate('ProfileSetup')} 
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="ProfileSetup">
            {props => (
              <ProfileSetupScreen 
                {...props} 
                onComplete={() => props.navigation.navigate('VibePicker')} 
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="VibePicker">
            {props => (
              <VibePickerScreen 
                onComplete={() => setIsAuthenticated(true)} 
                onBack={() => props.navigation.goBack()} 
              />
            )}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="CreateVibe" component={CreateVibeScreen} />
          <Stack.Screen name="VibeDetail" component={VibeDetailScreen} />
          <Stack.Screen name="MatchProfile" component={ProfileScreen} />
          <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
          <Stack.Screen name="DiscoveryDetail" component={DiscoveryDetailScreen} />
          <Stack.Screen name="MatchReveal" component={MatchRevealScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
