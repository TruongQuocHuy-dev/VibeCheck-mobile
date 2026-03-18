export type NotificationFilterTab = 'all' | 'unread' | 'saved';

export type NotificationKind = 'match' | 'message' | 'like' | 'system';

export interface NotificationMatchTarget {
  id: string;
  name: string;
  age: number;
  avatar: string;
  isOnline?: boolean;
}

export interface NotificationChatTarget {
  chatId: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  timeLabel: string;
  avatar?: string;
  isUnread?: boolean;
  isSaved?: boolean;
  dimmed?: boolean;
  highlightText?: string;
  matchTarget?: NotificationMatchTarget;
  chatTarget?: NotificationChatTarget;
}

export interface NotificationsScreenData {
  title: string;
  tabs: Array<{ id: NotificationFilterTab; label: string }>;
  items: NotificationItem[];
}
