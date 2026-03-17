/**
 * Interface representing a single chat item in the Inbox list.
 */
export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
}
