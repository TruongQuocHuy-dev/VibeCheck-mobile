export type NotificationFilterTab = 'all' | 'unread';

export type NotificationKind = 'match' | 'message' | 'like' | 'story' | 'system';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  timeLabel: string;
  avatar?: string;
  isUnread?: boolean;
  metadata?: Record<string, any>;
}

export interface NotificationsScreenData {
  title: string;
  tabs: Array<{ id: NotificationFilterTab; label: string }>;
  items: NotificationItem[];
  unreadCount: number;
}
