import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

/**
 * Auth API Service — calls backend with axios.
 * Replaces the old fetch-based auth.service.ts in the feature infrastructure folder.
 */

interface CheckPhoneResponse {
  exists: boolean;
  hasPassword: boolean;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  hasPassword: boolean;
  isProfileComplete: boolean;
  user: { id: string; phone: string; displayName: string | null };
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  isProfileComplete: boolean;
  user: { id: string; phone: string; displayName: string | null };
}

/**
 * POST /api/auth/check-phone
 * Checks if number is already registered.
 */
const checkPhone = async (phone: string): Promise<CheckPhoneResponse> => {
  return apiClient.post(ENDPOINTS.AUTH.CHECK_PHONE, { phone });
};

/**
 * POST /api/auth/register
 * Send Firebase idToken to BE → receive app JWT tokens + user info.
 */
const register = async (idToken: string): Promise<RegisterResponse> => {
  return apiClient.post(ENDPOINTS.AUTH.REGISTER, { idToken });
};

/**
 * POST /api/auth/set-password
 * New user sets password after OTP. Requires accessToken in header (set by interceptor).
 */
const setPassword = async (password: string): Promise<void> => {
  return apiClient.post(ENDPOINTS.AUTH.SET_PASSWORD, { password });
};

/**
 * POST /api/auth/login
 * Returning user logs in with phone + password.
 */
const login = async (phone: string, password: string): Promise<LoginResponse> => {
  return apiClient.post(ENDPOINTS.AUTH.LOGIN, { phone, password });
};

export const AuthApiService = { checkPhone, register, setPassword, login };
