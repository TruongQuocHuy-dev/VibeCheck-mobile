import { colors } from '../../../core/theme/colors';
import {
  SettingsSection,
  SettingsToggleState,
} from '../domain/types/settings.types';

export const initialSettingsToggles: SettingsToggleState = {
  newMatches: true,
  messages: true,
  promotions: false,
  darkMode: true,
  showDistance: true,
  showOnlineStatus: true,
};

export const settingsSections: SettingsSection[] = [
  {
    id: 'account',
    title: 'TÀI KHOẢN',
    items: [
      {
        id: 'edit-vibe-card',
        title: 'Chỉnh sửa hồ sơ',
        icon: 'person-outline',
        iconColor: colors.primary,
        type: 'link',
      },
      {
        id: 'change-password',
        title: 'Đổi mật khẩu',
        icon: 'lock-closed-outline',
        iconColor: colors.primary,
        type: 'link',
      },
      {
        id: 'delete-account',
        title: 'Xóa tài khoản',
        icon: 'person-remove-outline',
        iconColor: colors.error,
        type: 'danger',
      },
    ],
  },
  {
    id: 'notifications',
    title: 'THÔNG BÁO',
    items: [
      {
        id: 'new-matches',
        title: 'Tương hợp mới',
        icon: 'heart-outline',
        iconColor: colors.primary,
        type: 'toggle',
        toggleKey: 'newMatches',
      },
      {
        id: 'messages',
        title: 'Tin nhắn',
        icon: 'chatbubble-outline',
        iconColor: colors.primary,
        type: 'toggle',
        toggleKey: 'messages',
      },
      {
        id: 'promotions',
        title: 'Khuyến mãi & Tin tức',
        icon: 'sparkles-outline',
        iconColor: colors.primary,
        type: 'toggle',
        toggleKey: 'promotions',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'QUYỀN RIÊNG TƯ',
    items: [
      {
        id: 'show-distance',
        title: 'Hiển thị khoảng cách',
        icon: 'location-outline',
        iconColor: colors.primary,
        type: 'toggle',
        toggleKey: 'showDistance',
      },
      {
        id: 'show-online',
        title: 'Trạng thái trực tuyến',
        icon: 'eye-outline',
        iconColor: colors.primary,
        type: 'toggle',
        toggleKey: 'showOnlineStatus',
      },
      {
        id: 'blocked-list',
        title: 'Danh sách chặn',
        icon: 'ban-outline',
        iconColor: colors.primary,
        type: 'link',
      },
    ],
  },
  {
    id: 'appearance',
    title: 'GIAO DIỆN',
    items: [
      {
        id: 'dark-mode',
        title: 'Chế độ tối (Dark mode)',
        icon: 'moon-outline',
        iconColor: colors.primary,
        type: 'toggle',
        toggleKey: 'darkMode',
      },
      {
        id: 'language',
        title: 'Ngôn ngữ',
        icon: 'language-outline',
        iconColor: colors.primary,
        type: 'value',
        valueText: 'Tiếng Việt',
        valueTone: 'muted',
      },
    ],
  },
  {
    id: 'help',
    title: 'HỖ TRỢ',
    items: [
      {
        id: 'faq',
        title: 'Câu hỏi thường gặp (FAQ)',
        icon: 'help-circle-outline',
        iconColor: colors.primary,
        type: 'external',
      },
      {
        id: 'support-contact',
        title: 'Liên hệ hỗ trợ',
        icon: 'headset-outline',
        iconColor: colors.primary,
        type: 'link',
      },
      {
        id: 'terms',
        title: 'Điều khoản dịch vụ',
        icon: 'document-text-outline',
        iconColor: colors.primary,
        type: 'link',
      },
      {
        id: 'privacy-policy',
        title: 'Chính sách bảo mật',
        icon: 'shield-checkmark-outline',
        iconColor: colors.primary,
        type: 'link',
      },
    ],
  },
];

export const settingsAppVersion = 'VIBECHECK V1.0.0';
