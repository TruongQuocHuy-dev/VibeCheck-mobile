import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../features/auth/presentation/screens/WelcomeScreen';
import { OtpScreen } from '../features/auth/presentation/screens/OtpScreen';
import { CreatePasswordScreen } from '../features/auth/presentation/screens/CreatePasswordScreen';
import { ProfileSetupScreen } from '../features/auth/presentation/screens/ProfileSetupScreen';
import { VibePickerScreen } from '../features/auth/presentation/screens/VibePickerScreen';
import { TabNavigator } from './TabNavigator';
import { ChatDetailScreen } from '../features/chat/presentation/screens/ChatDetailScreen';
import { DiscoveryDetailScreen } from '../features/discovery/presentation/screens/DiscoveryDetailScreen';
import { MatchRevealScreen } from '../features/discovery/presentation/screens/MatchRevealScreen';
import { NotificationsScreen } from '../features/notifications/presentation/screens/NotificationsScreen';
import { ProfileScreen } from '../features/profile/presentation/screens/ProfileScreen';
import { SettingsScreen } from '../features/profile/presentation/screens/SettingsScreen';
import { CreateVibeScreen } from '../features/vibe/presentation/screens/CreateVibeScreen';
import { VibeDetailScreen } from '../features/vibe/presentation/screens/VibeDetailScreen';

import { getUser, getAccessToken } from '../infrastructure/storage/AsyncStorage';
import apiClient from '../infrastructure/api/axios';
import { ENDPOINTS } from '../infrastructure/api/endpoints';

const Stack = createNativeStackNavigator<any>();

export const AppNavigator = () => {
  const [appState, setAppState] = React.useState<'LOADING' | 'AUTH' | 'ONBOARDING_PASS' | 'ONBOARDING_PROFILE' | 'ONBOARDING_VIBES' | 'MAIN'>('LOADING');

  React.useEffect(() => {
    const hydrate = async () => {
      const token = await getAccessToken();
      const user: any = await getUser();

      if (!token || !user) {
        setAppState('AUTH');
        return;
      }

      try {
        // Verify token validity on startup
        const res: any = await apiClient.get(ENDPOINTS.USER.UPDATE_PROFILE);
        const apiUser = res?.user;

        if (user.hasPassword === false) {
          setAppState('ONBOARDING_PASS');
        } else if (user.isProfileComplete === false) {
          setAppState('ONBOARDING_PROFILE');
        } else if (!apiUser?.vibes || apiUser.vibes.length === 0) {
          setAppState('ONBOARDING_VIBES'); // Force them to pick vibe on reboot!
        } else {
          setAppState('MAIN');
        }
      } catch (err) {
        // Token is expired or invalid
        if (user?.hasPassword) {
          setAppState('ONBOARDING_PASS'); // Force enter password (Login)
        } else {
          setAppState('AUTH');
        }
      }
    };
    hydrate();
  }, []);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('unauthorized_token_expired', () => {
      setAppState('ONBOARDING_PASS');
    });

    const sub2 = DeviceEventEmitter.addListener('login_success_reauth', async () => {
      const user: any = await getUser();
      if (user?.isProfileComplete) {
        setAppState('MAIN');
      } else {
        setAppState('ONBOARDING_PROFILE');
      }
    });

    const sub3 = DeviceEventEmitter.addListener('logout', async () => {
      const { clearSession } = require('../infrastructure/storage/AsyncStorage');
      await clearSession();
      setAppState('AUTH');
    });

    return () => {
      sub.remove();
      sub2.remove();
      sub3.remove();
    };
  }, []);

  if (appState === 'LOADING') {
    return null; // Render loading screen or splash
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {appState === 'AUTH' && (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="OtpScreen">
            {props => (
              <OtpScreen 
                {...props} 
                onLoginSuccess={() => setAppState('MAIN')} 
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
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
                onComplete={() => setAppState('MAIN')} 
                onBack={() => props.navigation.goBack()} 
              />
            )}
          </Stack.Screen>
        </>
      )}

      {appState === 'ONBOARDING_PASS' && (
        <>
          <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
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
                onComplete={() => setAppState('MAIN')} 
                onBack={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </>
      )}

      {appState === 'ONBOARDING_PROFILE' && (
        <>
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
                onComplete={() => setAppState('MAIN')} 
                onBack={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </>
      )}
      {appState === 'ONBOARDING_VIBES' && (
        <Stack.Screen name="VibePicker">
          {props => (
            <VibePickerScreen 
              onComplete={() => setAppState('MAIN')} 
              onBack={() => setAppState('ONBOARDING_PROFILE')}
            />
          )}
        </Stack.Screen>
      )}
      {appState === 'MAIN' && (
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
