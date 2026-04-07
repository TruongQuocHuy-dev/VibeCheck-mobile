import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

const CACHE_KEY = '@last_known_location';
const DISTANCE_THRESHOLD = 500; // meters
const TIME_THRESHOLD = 30 * 60 * 1000; // 30 minutes in ms

interface CachedLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export const LocationService = {
  /**
   * Request location permission
   */
  requestPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      return auth === 'granted';
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'VibeCheck cần truy cập vị trí',
          message: 'Vị trí của bạn giúp tìm kiếm những người bạn xung quanh.',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Hủy',
          buttonPositive: 'Đồng ý',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return false;
  },

  /**
   * Get current position with options
   */
  getCurrentPosition: (): Promise<Geolocation.GeoPosition> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  },

  /**
   * Calculate distance between two points (Haversine formula) in meters
   */
  getDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  },

  /**
   * Smart sync location with backend based on distance/time thresholds
   */
  syncLocation: async (): Promise<void> => {
    try {
      const hasPermission = await LocationService.requestPermission();
      if (!hasPermission) return;

      const position = await LocationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const now = Date.now();

      // Check cache
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const lastLocation: CachedLocation = JSON.parse(cachedData);
        
        const distance = LocationService.getDistance(
          latitude,
          longitude,
          lastLocation.latitude,
          lastLocation.longitude
        );
        const timeDiff = now - lastLocation.timestamp;

        // Threshold check: move > 500m OR > 30 mins
        if (distance < DISTANCE_THRESHOLD && timeDiff < TIME_THRESHOLD) {
          console.log(`[LocationService] Skip sync. Distance: ${distance.toFixed(0)}m, Time: ${(timeDiff / 60000).toFixed(0)}min`);
          return;
        }
      }

      // Sync with backend
      console.log(`[LocationService] Syncing location: ${latitude}, ${longitude}`);
      await apiClient.patch(ENDPOINTS.USER.UPDATE_PROFILE, {
        latitude,
        longitude,
      });

      // Update cache
      const newCache: CachedLocation = {
        latitude,
        longitude,
        timestamp: now,
      };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
    } catch (error) {
      console.error('[LocationService] Sync error:', error);
    }
  },
};
