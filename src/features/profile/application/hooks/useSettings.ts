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

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const useSettings = () => {
  const navigation = useNavigation<SettingsNavProp>();
  const [toggleState, setToggleState] = useState<SettingsToggleState>(initialSettingsToggles);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggle = useCallback((key: SettingsToggleKey, value: boolean) => {
    setToggleState((prev) => ({
      ...prev,
      [key]: value,
    }));
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
