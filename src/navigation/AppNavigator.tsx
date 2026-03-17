import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../features/auth/presentation/screens/WelcomeScreen';
import { OtpScreen } from '../features/auth/presentation/screens/OtpScreen';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

import { ProfileSetupScreen } from '../features/auth/presentation/screens/ProfileSetupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

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
                onComplete={() => setIsAuthenticated(true)} 
              />
            )}
          </Stack.Screen>
        </>
      ) : (
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

