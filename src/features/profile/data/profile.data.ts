import { UserProfile } from '../domain/types/profile.types';

export const profileMockData: UserProfile = {
  id: 'profile-john-123',
  username: '@john123',
  handle: 'john.doe',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80',
  isVerified: true,
  stats: [
    { id: 'stats-vibes', label: 'Vibes', value: 0 },
    { id: 'stats-matches', label: 'Matches', value: 0 },
    { id: 'stats-likes', label: 'Likes', value: 0 },
    { id: 'stats-boosts', label: 'Boosts', value: 0 },
  ],
  premiumPlan: {
    id: 'premium-v1',
    title: 'VibeCheck Premium',
    perks: ['Xem ai da like ban', 'Browse an danh', '5 Boost mien phi/thang'],
    ctaLabel: 'Nang cap ngay',
  },
  birthYear: 1998,
  location: 'Quận 1, TP. Hồ Chí Minh',
};