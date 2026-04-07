import { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import {
  initialSettingsToggles,
  settingsAppVersion,
  settingsSections,
} from '../../data/settings.data';
import {
  SettingsItem,
  SettingsToggleKey,
  SettingsToggleState,
} from '../../domain/types/settings.types';

import { useEffect } from 'react';
import { useProfile } from './useProfile';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const useSettings = () => {
  const navigation = useNavigation<SettingsNavProp>();
  const { ownProfileData } = useProfile();
  const [toggleState, setToggleState] = useState<SettingsToggleState>(initialSettingsToggles);

  // Sync state with actual profile data
  useEffect(() => {
    if (ownProfileData?.privacySettings) {
      setToggleState(prev => ({
        ...prev,
        showOnlineStatus: ownProfileData.privacySettings.showOnlineStatus ?? true,
        showDistance: ownProfileData.privacySettings.showDistance ?? true,
      }));
    }
  }, [ownProfileData]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggle = useCallback(async (key: SettingsToggleKey, value: boolean) => {
    // Opimistic UI update
    setToggleState((prev) => ({
      ...prev,
      [key]: value,
    }));

    // If it's a privacy setting, sync to backend
    if (key === 'showOnlineStatus' || key === 'showDistance') {
      try {
        await apiClient.patch(ENDPOINTS.USER.UPDATE_PRIVACY, {
          [key]: value,
        });
      } catch (err) {
        console.error('Failed to sync privacy setting:', err);
        // Rollback on error
        setToggleState((prev) => ({
          ...prev,
          [key]: !value,
        }));
      }
    }
  }, []);

  const handleItemPress = useCallback((item: SettingsItem) => {
    switch (item.id) {
      case 'edit-vibe-card':
        navigation.navigate('VibeCardEditor');
        break;
      case 'change-password':
        navigation.navigate('ChangePassword');
        break;
      case 'blocked-list':
        navigation.navigate('BlockedList');
        break;
      case 'faq':
        Linking.openURL('https://vibecheck.app/faq').catch(err => 
          console.error('Could not open FAQ URL', err)
        );
        break;
      case 'support-contact':
        navigation.navigate('SupportContact');
        break;
      case 'terms':
        navigation.navigate('TermsOfService');
        break;
      case 'privacy-policy':
        navigation.navigate('PrivacyPolicy');
        break;
      case 'delete-account':
        console.log('Delete account pressed');
        break;
      case 'logout':
        const { DeviceEventEmitter } = require('react-native');
        DeviceEventEmitter.emit('logout');
        break;
      default:
        console.log(`Pressed: ${item.id}`);
        break;
    }
  }, [navigation]);

  const handleLogout = useCallback(() => {
    handleItemPress({
      id: 'logout',
      title: 'ĐĂNG XUẤT',
      icon: 'log-out-outline',
      type: 'danger',
    });
  }, [handleItemPress]);

  return {
    settingsSections,
    toggleState,
    appVersion: settingsAppVersion,
    handleBack,
    handleToggle,
    handleItemPress,
    handleLogout,
  };
};
