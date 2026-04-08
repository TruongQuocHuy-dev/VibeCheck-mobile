import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import {
  NotificationFilterTab,
  NotificationItem,
} from '../../domain/types/notification.types';
import { NotificationService } from '../../../../infrastructure/services/notification.service';
import { onSocketEvent, offSocketEvent } from '../../../../infrastructure/services/socket.service';

type NotificationsNavigation = NativeStackNavigationProp<RootStackParamList>;

const TABS: Array<{ id: NotificationFilterTab; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'unread', label: 'Chưa đọc' },
];

const KIND_ICONS: Record<string, string> = {
  match: '💞',
  message: '💬',
  like: '😍',
  story: '✨',
  system: '🔔',
};

const formatTimeLabel = (createdAt: string): string => {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(createdAt).toLocaleDateString('vi-VN');
};

const mapPayloadToItem = (payload: any): NotificationItem => ({
  id: payload._id || payload.id,
  kind: payload.kind,
  title: `${KIND_ICONS[payload.kind] || '🔔'} ${payload.title}`,
  message: payload.message,
  timeLabel: formatTimeLabel(payload.createdAt),
  avatar: payload.avatar || undefined,
  isUnread: payload.isUnread ?? true,
  metadata: payload.metadata,
});

export const useNotifications = () => {
  const navigation = useNavigation<NotificationsNavigation>();
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>('all');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isMounted = useRef(true);

  // Fetch from API
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await NotificationService.getAll();
      if (!isMounted.current) return;
      setItems((res.items || []).map(mapPayloadToItem));
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      // Silently fail — UI shows empty
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchNotifications();
    return () => { isMounted.current = false; };
  }, [fetchNotifications]);

  // Real-time: listen for new notifications via socket
  useEffect(() => {
    const handleNewNotification = (payload: any) => {
      if (!isMounted.current) return;
      const newItem = mapPayloadToItem(payload);
      setItems((prev) => [newItem, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    onSocketEvent<any>('new_notification', handleNewNotification);
    return () => {
      offSocketEvent<any>('new_notification', handleNewNotification);
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeTab === 'unread') return items.filter((i) => i.isUnread);
    return items;
  }, [activeTab, items]);

  const selectedCount = selectedIds.length;

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleToggleMenu = useCallback(() => setMenuVisible((p) => !p), []);
  const handleTabPress = useCallback((tab: NotificationFilterTab) => setActiveTab(tab), []);

  const handleMarkAllRead = useCallback(async () => {
    setMenuVisible(false);
    setItems((prev) => prev.map((i) => ({ ...i, isUnread: false })));
    setUnreadCount(0);
    try { await NotificationService.markAllRead(); } catch { /* noop */ }
  }, []);

  const handleStartSelection = useCallback(() => {
    setSelectionMode(true);
    setSelectedIds([]);
    setMenuVisible(false);
  }, []);

  const handleCancelSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds([]);
  }, []);

  const handleToggleSelectItem = useCallback((itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) return;
    const toDelete = [...selectedIds];
    setItems((prev) => prev.filter((i) => !toDelete.includes(i.id)));
    setSelectedIds([]);
    setSelectionMode(false);
    try {
      await Promise.all(toDelete.map((id) => NotificationService.deleteOne(id)));
    } catch { /* noop */ }
  }, [selectedIds]);

  const handleDeleteAll = useCallback(async () => {
    setItems([]);
    setUnreadCount(0);
    setSelectedIds([]);
    setSelectionMode(false);
    setMenuVisible(false);
    try { await NotificationService.deleteAll(); } catch { /* noop */ }
  }, []);

  const handleNotificationLongPress = useCallback(
    (item: NotificationItem) => {
      if (!selectionMode) {
        setSelectionMode(true);
        setMenuVisible(false);
      }
      handleToggleSelectItem(item.id);
    },
    [handleToggleSelectItem, selectionMode]
  );

  const handleNotificationPress = useCallback(
    (item: NotificationItem) => {
      if (selectionMode) {
        handleToggleSelectItem(item.id);
        return;
      }

      // Mark as read locally
      if (item.isUnread) {
        setItems((prev) =>
          prev.map((v) => (v.id !== item.id ? v : { ...v, isUnread: false }))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        NotificationService.markOneRead(item.id).catch(() => {});
      }

      const meta = item.metadata || {};

      if (item.kind === 'match' && meta.matchedUser) {
        navigation.navigate('MatchProfile' as any, {
          id: meta.matchedUser._id,
          name: meta.matchedUser.fullName || meta.matchedUser.displayName,
          avatar: meta.matchedUser.avatar,
          conversationId: meta.conversationId,
        });
        return;
      }

      if (item.kind === 'message' && meta.conversationId) {
        navigation.navigate('ChatDetail' as any, {
          conversationId: meta.conversationId,
          otherUserId: meta.senderId,
        });
        return;
      }

      if ((item.kind === 'like' || item.kind === 'story') && meta.authorId) {
        navigation.navigate('MatchProfile' as any, { id: meta.authorId });
      }
    },
    [handleToggleSelectItem, navigation, selectionMode]
  );

  return {
    title: 'Thông báo',
    tabs: TABS,
    activeTab,
    filteredItems,
    unreadCount,
    loading,
    menuVisible,
    selectionMode,
    selectedIds,
    selectedCount,
    handleBack,
    handleToggleMenu,
    handleMarkAllRead,
    handleStartSelection,
    handleCancelSelection,
    handleDeleteSelected,
    handleDeleteAll,
    handleTabPress,
    handleNotificationLongPress,
    handleNotificationPress,
  };
};
