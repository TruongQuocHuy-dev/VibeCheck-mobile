/**
 * App Configuration
 * 
 * ⚙️ System-level configuration (NOT UI theme)
 * 
 * For environment-specific configuration:
 * 📦 Install: npm install react-native-config
 * 📝 Then use: import Config from 'react-native-config';
 */

// @ts-ignore
import { API_BASE_URL, GOOGLE_WEB_CLIENT_ID } from '@env';

export const APP_CONFIG = Object.freeze({
  isDev: __DEV__,
  apiBaseUrl: API_BASE_URL,
  appName: 'VibeCheck',
  appVersion: '1.0.0',
  timeout: 30000,
  /**
   * 🔑 GOOGLE_WEB_CLIENT_ID
   * Managed via .env variable GOOGLE_WEB_CLIENT_ID
   */
  googleWebClientId: GOOGLE_WEB_CLIENT_ID || 'PENDING_DOTENV_LOAD',
} as const);

export type AppConfig = typeof APP_CONFIG;
