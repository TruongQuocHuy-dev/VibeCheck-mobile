/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/shared/components/feedback/Error/ErrorBoundary';
import { ToastProvider } from './src/shared/providers/ToastProvider';
import { LoadingProvider } from './src/shared/providers/LoadingProvider';
import { NetworkProvider } from './src/shared/providers/NetworkProvider';
import { UnreadProvider } from './src/shared/providers/UnreadProvider';

import { StatusBar } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

function App() {
  return (
    <ErrorBoundary>
      <KeyboardProvider>
        <ToastProvider>
          <LoadingProvider>
            <NetworkProvider>
              <UnreadProvider>
                <NavigationContainer>
                  <StatusBar 
                    translucent 
                    backgroundColor="transparent" 
                    barStyle="light-content" 
                  />
                  <AppNavigator />
                </NavigationContainer>
              </UnreadProvider>
            </NetworkProvider>
          </LoadingProvider>
        </ToastProvider>
      </KeyboardProvider>
    </ErrorBoundary>
  );
}

export default App;
