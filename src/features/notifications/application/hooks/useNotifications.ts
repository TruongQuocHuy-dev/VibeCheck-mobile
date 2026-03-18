import { useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { notificationsMockData } from '../../data/notifications.data';
import {
  NotificationFilterTab,
  NotificationItem,
} from '../../domain/types/notification.types';

type NotificationsNavigation = NativeStackNavigationProp<RootStackParamList>;

export const useNotifications = () => {
  const navigation = useNavigation<NotificationsNavigation>();
  const [activeTab, setActiveTab] = useState<NotificationFilterTab>('all');
  const [items, setItems] = useState<NotificationItem[]>(notificationsMockData.items);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') {
      return items;
    }

    if (activeTab === 'unread') {
      return items.filter((item) => item.isUnread);
    }

    return items.filter((item) => item.isSaved);
  }, [activeTab, items]);

  const selectedCount = selectedIds.length;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggleMenu = useCallback(() => {
    setMenuVisible((prev) => !prev);
  }, []);

  const handleTabPress = useCallback((tab: NotificationFilterTab) => {
    setActiveTab(tab);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setItems((prev) => prev.map((item) => ({ ...item, isUnread: false })));
    setMenuVisible(false);
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
    setSelectedIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }

      return [...prev, itemId];
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedIds.length === 0) {
      return;
    }

    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setSelectionMode(false);
  }, [selectedIds]);

  const handleDeleteAll = useCallback(() => {
    setItems([]);
    setSelectedIds([]);
    setSelectionMode(false);
    setMenuVisible(false);
  }, []);

  const handleNotificationLongPress = useCallback(
    (item: NotificationItem) => {
      if (!selectionMode) {
        setSelectionMode(true);
        setMenuVisible(false);
      }

      handleToggleSelectItem(item.id);
    },
    [handleToggleSelectItem, selectionMode],
  );

  const handleNotificationPress = useCallback(
    (item: NotificationItem) => {
      if (selectionMode) {
        handleToggleSelectItem(item.id);
        return;
      }

      if (item.isUnread) {
        setItems((prev) => prev.map((value) => {
          if (value.id !== item.id) {
            return value;
          }

          return {
            ...value,
            isUnread: false,
          };
        }));
      }

      if (item.kind === 'match' && item.matchTarget) {
        navigation.navigate('MatchProfile', item.matchTarget);
        return;
      }

      if (item.kind === 'message' && item.chatTarget) {
        navigation.navigate('ChatDetail', item.chatTarget);
        return;
      }

      if (item.kind === 'system') {
        navigation.goBack();
      }
    },
    [handleToggleSelectItem, navigation, selectionMode],
  );

  return {
    title: notificationsMockData.title,
    tabs: notificationsMockData.tabs,
    activeTab,
    filteredItems,
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
