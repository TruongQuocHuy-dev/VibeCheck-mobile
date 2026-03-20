import { UserProfile } from '../domain/types/profile.types';

export const profileMockData: UserProfile = {
  id: 'profile-john-123',
  username: '@john123',
  handle: 'john.doe',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80',
  isVerified: true,
  stats: [
    { id: 'stats-vibes', label: 'Vibes', value: 24 },
    { id: 'stats-matches', label: 'Matches', value: 156 },
    { id: 'stats-likes', label: 'Likes', value: 892 },
    { id: 'stats-boosts', label: 'Boosts', value: 3 },
  ],
  currentVibe: {
    id: 'current-vibe-1',
    text: 'Feeling the Cyberpunk Chill tonight',
    expiresIn: '12h con lai',
    backgroundImage:
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=900&q=80',
  },
  premiumPlan: {
    id: 'premium-v1',
    title: 'VibeCheck Premium',
    perks: ['Xem ai da like ban', 'Browse an danh', '5 Boost mien phi/thang'],
    ctaLabel: 'Nang cap ngay',
  },
  pastVibes: [
    {
      id: 'past-vibe-1',
      image:
        'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&w=600&q=80',
      statusLabel: 'Da het han',
    },
    {
      id: 'past-vibe-2',
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      statusLabel: 'Da het han',
    },
  ],
};