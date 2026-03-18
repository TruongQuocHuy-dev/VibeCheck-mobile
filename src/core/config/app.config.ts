/**
 * App Configuration
 * 
 * ⚙️ System-level configuration (NOT UI theme)
 * 
 * For environment-specific configuration:
 * 📦 Install: npm install react-native-config
 * 📝 Then use: import Config from 'react-native-config';
 */

// API Configuration
// TODO: Implement with react-native-config for proper environment management
export const API_BASE_URL = __DEV__ 
  ? 'https://api.dev.vibecheck.local'
  : 'https://api.vibecheck.local';

export const APP_CONFIG = Object.freeze({
  isDev: __DEV__,
  apiBaseUrl: API_BASE_URL,
  appName: 'VibeCheck',
  appVersion: '1.0.0',
  timeout: 30000, // 30 seconds
} as const);

export type AppConfig = typeof APP_CONFIG;
