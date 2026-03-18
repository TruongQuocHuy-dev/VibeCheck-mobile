import { NotificationsScreenData } from '../domain/types/notification.types';

export const notificationsMockData: NotificationsScreenData = {
  title: 'Thong bao',
  tabs: [
    { id: 'all', label: 'Tat ca' },
    { id: 'unread', label: 'Chua doc' },
    { id: 'saved', label: 'Da luu' },
  ],
  items: [
    {
      id: 'notif-match-linh',
      kind: 'match',
      title: 'Match moi',
      message: 'Ban va Linh vua tuong hop!',
      highlightText: 'Linh',
      timeLabel: 'Vua xong',
      avatar:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      isUnread: true,
      matchTarget: {
        id: 'match-linh',
        name: 'Linh',
        age: 24,
        avatar:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
        isOnline: true,
      },
    },
    {
      id: 'notif-reply-nam',
      kind: 'message',
      title: 'Phan hoi moi',
      message: 'Cuoi tuan nay ban co ranh khong?',
      timeLabel: '5 phut',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      isUnread: true,
      chatTarget: {
        chatId: 'chat-hoang-nam',
        name: 'Hoang Nam',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        isOnline: true,
      },
    },
    {
      id: 'notif-like-new',
      kind: 'like',
      title: 'Luot thich moi',
      message: 'Ai do vua thich ho so cua ban.',
      timeLabel: '2 gio',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isSaved: true,
    },
    {
      id: 'notif-match-hong',
      kind: 'match',
      title: 'Match moi',
      message: 'Ban va Hong da tuong hop!',
      highlightText: 'Hong',
      timeLabel: 'Hom qua',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      dimmed: true,
      matchTarget: {
        id: 'match-hong',
        name: 'Hong',
        age: 23,
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        isOnline: false,
      },
    },
    {
      id: 'notif-system-vibe',
      kind: 'system',
      title: 'Goi y vibe moi',
      message: "Kham pha cac vibe 'Chill House' dang hot.",
      timeLabel: 'Hom qua',
      dimmed: true,
    },
  ],
};
