import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

const KEYS = {
  ACCESS_TOKEN: '@vibecheck/access_token',
  REFRESH_TOKEN: '@vibecheck/refresh_token',
  USER: '@vibecheck/user',
  IS_AUTHENTICATED: '@vibecheck/is_authenticated',
} as const;

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await EncryptedStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
  await EncryptedStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
};

export const getAccessToken = async (): Promise<string | null> => {
  return EncryptedStorage.getItem(KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return EncryptedStorage.getItem(KEYS.REFRESH_TOKEN);
};

export const clearSession = async () => {
  await EncryptedStorage.removeItem(KEYS.ACCESS_TOKEN);
  await EncryptedStorage.removeItem(KEYS.REFRESH_TOKEN);
  await AsyncStorage.removeItem(KEYS.USER);
  await AsyncStorage.removeItem(KEYS.IS_AUTHENTICATED);
};

export const saveUser = async (user: object) => {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
};

export const getUser = async (): Promise<object | null> => {
  const data = await AsyncStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export { KEYS };
