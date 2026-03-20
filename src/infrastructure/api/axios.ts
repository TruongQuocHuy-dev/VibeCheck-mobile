import axios from 'axios';
import { APP_CONFIG } from '../../core/config/app.config';
import { getAccessToken } from '../storage/AsyncStorage';

/**
 * Global Axios instance — all API calls go through here.
 * Base URL is read from app config (no hardcoded IPs in source).
 */
const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: APP_CONFIG.timeout,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach access token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle global errors
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns { status: 'success', data: ... }, unwrap to only return the data node.
    if (response.data && response.data.status === 'success') {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const { DeviceEventEmitter } = require('react-native');
        DeviceEventEmitter.emit('unauthorized_token_expired');
      } catch (e) {
        console.log('Event emit error:', e);
      }
    }
    const message =
      error.response?.data?.message || error.message || 'Lỗi kết nối máy chủ';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
