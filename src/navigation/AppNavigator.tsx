import React from 'react';
import { DeviceEventEmitter, AppState, AppStateStatus } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../features/auth/presentation/screens/WelcomeScreen';
import { OtpScreen } from '../features/auth/presentation/screens/OtpScreen';
import { CreatePasswordScreen } from '../features/auth/presentation/screens/CreatePasswordScreen';
import { ProfileSetupScreen } from '../features/auth/presentation/screens/ProfileSetupScreen';
import { VibePickerScreen } from '../features/auth/presentation/screens/VibePickerScreen';
import { TabNavigator } from './TabNavigator';
import { ChatDetailScreen } from '../features/chat/presentation/screens/ChatDetailScreen';
import { ChatInfoScreen } from '../features/chat/presentation/screens/ChatInfoScreen';
import { DiscoveryDetailScreen } from '../features/discovery/presentation/screens/DiscoveryDetailScreen';
import { MatchRevealScreen } from '../features/discovery/presentation/screens/MatchRevealScreen';
import { NotificationsScreen } from '../features/notifications/presentation/screens/NotificationsScreen';
import { ProfileScreen } from '../features/profile/presentation/screens/ProfileScreen';
import { SettingsScreen } from '../features/profile/presentation/screens/SettingsScreen';
import { CreateVibeScreen } from '../features/vibe/presentation/screens/CreateVibeScreen';
import { VibeDetailScreen } from '../features/vibe/presentation/screens/VibeDetailScreen';
import { FeedScreen } from '../features/posts/presentation/screens/FeedScreen';
import { VibeCardEditorScreen } from '../features/profile/presentation/screens/VibeCardEditorScreen';
import { ChangePasswordScreen } from '../features/auth/presentation/screens/ChangePasswordScreen';
import { BlockedListScreen } from '../features/profile/presentation/screens/BlockedListScreen';

import { getUser, getAccessToken } from '../infrastructure/storage/AsyncStorage';
import apiClient from '../infrastructure/api/axios';
import { ENDPOINTS } from '../infrastructure/api/endpoints';
import { connectSocket, disconnectSocket } from '../infrastructure/services/socket.service';

const Stack = createNativeStackNavigator<any>();

import { useUnreadCount } from '../shared/providers/UnreadProvider';

export const AppNavigator = () => {
  const { refreshUnread } = useUnreadCount();
  const [appState, setAppState] = React.useState<'LOADING' | 'AUTH' | 'ONBOARDING_PASS' | 'ONBOARDING_PROFILE' | 'ONBOARDING_VIBES' | 'MAIN'>('LOADING');
  const appStateRef = React.useRef(AppState.currentState);

  const checkAndNavigate = React.useCallback(async () => {
    try {
      const token = await getAccessToken();
      const user: any = await getUser();

      if (!token || !user) {
        setAppState('AUTH');
        return;
      }

      // Always fetch fresh profile to ensure sync after login/startup
      const res: any = await apiClient.get(ENDPOINTS.USER.GET_PROFILE);
      const apiUser = res?.user || res?.data;

      if (apiUser) {
        const { saveUser } = require('../infrastructure/storage/AsyncStorage');
        await saveUser(apiUser); // Save full profile
      }

      // Decision logic correctly based on latest API state
      if (apiUser?.hasPassword === false) {
        setAppState('ONBOARDING_PASS');
      } else if (apiUser?.isProfileComplete === false) {
        setAppState('ONBOARDING_PROFILE');
      } else if (!apiUser?.vibes || apiUser.vibes.length === 0) {
        setAppState('ONBOARDING_VIBES');
      } else {
        setAppState('MAIN');
      }
    } catch (err) {
      const user: any = await getUser();
      if (user?.hasPassword) {
        setAppState('ONBOARDING_PASS');
      } else {
        setAppState('AUTH');
      }
    }
  }, [refreshUnread]);

  React.useEffect(() => {
    checkAndNavigate();
  }, [checkAndNavigate]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('unauthorized_token_expired', () => {
      setAppState('ONBOARDING_PASS');
    });

    const sub2 = DeviceEventEmitter.addListener('login_success_reauth', async () => {
      await checkAndNavigate(); // Now uses fresh API data
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

  // Handle Socket Connection based on AppState (Background/Foreground)
  React.useEffect(() => {
    let mounted = true;

    const setupSocket = async (forceConnect = false) => {
      console.log(`[SocketSetup] appState: ${appState}`);
      if (appState !== 'MAIN') {
        console.log('[SocketSetup] Not in MAIN state, disconnecting...');
        disconnectSocket();
        return;
      }

      let user: any = await getUser();
      if (!mounted) return;

      // Robust ID detection
      let userId = user?._id || user?.id || user?.uid;

      // AUTO-REPAIR: If in MAIN but missing ID, fetch from API
      if (!userId && appState === 'MAIN') {
        console.log('[SocketSetup] ID missing in MAIN, attempting auto-repair via API...');
        try {
          const res: any = await apiClient.get(ENDPOINTS.USER.GET_PROFILE);
          const apiUser = res?.user || res?.data;
          if (apiUser) {
            const { saveUser } = require('../infrastructure/storage/AsyncStorage');
            await saveUser(apiUser);
            user = apiUser;
            userId = apiUser._id || apiUser.id;
            console.log(`[SocketSetup] Auto-repair success! Found userId: ${userId}`);
          }
        } catch (err) {
          console.error('[SocketSetup] Auto-repair failed:', err);
        }
      }

      console.log(`[SocketSetup] Final userId: ${userId}`);

      if (userId) {
        await connectSocket(userId);
      } else {
        console.warn('[SocketSetup] userId is missing, cannot connect socket.');
        console.log('[SocketSetup] Full user object in storage:', JSON.stringify(user));
        if (appState === 'MAIN') {
          console.log('[SocketSetup] Triggering logout due to missing ID...');
          DeviceEventEmitter.emit('logout');
        }
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('📱 App has come to the foreground, connecting socket...');
        setupSocket(true);
        if (appState === 'MAIN') {
          refreshUnread();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('💤 App has gone to the background, disconnecting socket...');
        disconnectSocket();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initial setup
    setupSocket();

    return () => {
      mounted = false;
      subscription.remove();
      // Only disconnect if we are leaving the MAIN state globally
      // (Actual backgrounding is handled by handleAppStateChange)
    };
  }, [appState]);

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
          <Stack.Screen name="ProfileSetup">
            {props => (
              <ProfileSetupScreen
                {...props}
                onComplete={() => props.navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="CreateVibe" component={CreateVibeScreen} />
          <Stack.Screen name="VibeDetail" component={VibeDetailScreen} />
          <Stack.Screen name="MatchProfile" component={ProfileScreen} />
          <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
          <Stack.Screen name="ChatInfo" component={ChatInfoScreen} />
          <Stack.Screen name="DiscoveryDetail" component={DiscoveryDetailScreen} />
          <Stack.Screen
            name="MatchReveal"
            component={MatchRevealScreen}
            options={{ animation: 'none' }}
          />
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="VibeCardEditor" component={VibeCardEditorScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="BlockedList" component={BlockedListScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
