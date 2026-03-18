import { VibeDetailData } from '../domain/types/vibe-detail.types';

export const vibeDetailMockData: VibeDetailData = {
  id: 'vibe-detail-001',
  caption: 'Feeling the Cyberpunk Chill tonight',
  location: 'Hồ Chí Minh City',
  expiresIn: '12h còn lại',
  backgroundImage:
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=80',
  track: {
    title: 'Nightcall',
    artist: 'Kavinsky',
  },
  stats: [
    { id: 'views', label: 'VIEWS', value: 234, accent: 'primary' },
    { id: 'reacts', label: 'REACTS', value: 45, accent: 'secondary' },
    { id: 'comments', label: 'COMMS', value: 12 },
    { id: 'shares', label: 'SHARES', value: 8 },
  ],
  reactions: [
    {
      id: 'react-u1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      reaction: 'heart',
      ring: 'primary',
    },
    {
      id: 'react-u2',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      reaction: 'fire',
      ring: 'secondary',
    },
    {
      id: 'react-u3',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      reaction: 'heart',
      ring: 'neutral',
    },
    {
      id: 'react-u4',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      reaction: 'heart',
      ring: 'neutral',
    },
    {
      id: 'react-u5',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      reaction: 'fire',
      ring: 'neutral',
    },
  ],
  comments: [
    {
      id: 'comment-1',
      userName: 'Linh Nguyen',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      content: 'Vibe chất quá! Nhìn giống bối cảnh phim ghê ✨',
      likes: 12,
      timeAgo: '2 phút trước',
    },
    {
      id: 'comment-2',
      userName: 'Minh Hoang',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      content: 'Thích cái mood này ghê, bữa nào cafe không?',
      likes: 5,
      timeAgo: '15 phút trước',
    },
  ],
  viewerBlurAvatars: [
    'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80',
  ],
};
