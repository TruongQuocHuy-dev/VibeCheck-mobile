import { MatchesScreenData } from '../domain/types/matches.types';

export const matchesMockData: MatchesScreenData = {
  newMatches: [
    {
      id: 'match-linh',
      name: 'Linh',
      age: 24,
      avatar:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      isOnline: true,
      isNew: true,
    },
    {
      id: 'match-son',
      name: 'Sơn',
      age: 21,
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      isOnline: true,
    },
    {
      id: 'match-mai',
      name: 'Mai',
      age: 23,
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      isNew: true,
    },
    {
      id: 'match-tuan',
      name: 'Tuấn',
      age: 25,
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  ],
  matchVibes: [
    {
      id: 'vibe-linh-chi',
      ownerName: 'Linh Chi',
      ownerAvatar:
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
      backgroundImage:
        'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80',
      expiresIn: '8h',
      hasMusic: true,
      hasLocation: true,
    },
    {
      id: 'vibe-hoang-nam',
      ownerName: 'Hoàng Nam',
      ownerAvatar:
        'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=300&q=80',
      backgroundImage:
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=700&q=80',
      expiresIn: '14h',
      hasMusic: true,
      hasLocation: false,
    },
    {
      id: 'vibe-thuy-anh',
      ownerName: 'Thùy Anh',
      ownerAvatar:
        'https://images.unsplash.com/photo-1521146764736-56c929d59c83?auto=format&fit=crop&w=300&q=80',
      backgroundImage:
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
      expiresIn: '22h',
      hasMusic: false,
      hasLocation: false,
    },
  ],
  lockedLikes: [
    {
      id: 'locked-like-1',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'locked-like-2',
      avatar:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    },
  ],
  totalLockedLikes: 12,
};
