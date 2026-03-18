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

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <LoadingProvider>
          <NetworkProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </NetworkProvider>
        </LoadingProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
