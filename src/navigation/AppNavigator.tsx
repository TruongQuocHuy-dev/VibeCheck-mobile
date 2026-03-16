import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/Welcome';
import { OtpScreen } from '../screens/Auth/OtpScreen';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

import { ProfileSetupScreen } from '../screens/Auth/ProfileSetupScreen';

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

