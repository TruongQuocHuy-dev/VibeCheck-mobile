export type SettingsToggleKey = 'newMatches' | 'messages' | 'promotions' | 'darkMode' | 'showOnlineStatus' | 'showDistance';

export type SettingsItemType = 'link' | 'toggle' | 'value' | 'danger' | 'external';

export type SettingsValueTone = 'primary' | 'muted';

export interface SettingsItem {
  id: string;
  title: string;
  icon: string;
  iconColor?: string;
  type: SettingsItemType;
  valueText?: string;
  valueTone?: SettingsValueTone;
  toggleKey?: SettingsToggleKey;
}

export interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

export type SettingsToggleState = Record<SettingsToggleKey, boolean>;
