import { MatchProfileDetail } from '../domain/types/matches.types';

const defaultProfileDetail: MatchProfileDetail = {
  id: 'default',
  bio: 'Yeu cafe, di bo dem va tim nguoi co the noi chuyen that lau.',
  distanceKm: 3,
  interests: ['Cafe', 'Am nhac', 'Travel'],
  recentVibePhotos: [
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80',
  ],
};

const matchProfileById: Record<string, MatchProfileDetail> = {
  'match-linh': {
    id: 'match-linh',
    bio: 'Thich chup anh film, doc sach va hunt mon ngon moi moi cuoi tuan.',
    distanceKm: 2,
    interests: ['Film photo', 'Book', 'Food tour'],
    recentVibePhotos: [
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=700&q=80',
    ],
  },
  'match-son': {
    id: 'match-son',
    bio: 'Gym 3 buoi/tuan, me indie rock va da bong cuoi ngay.',
    distanceKm: 5,
    interests: ['Gym', 'Indie rock', 'Football'],
    recentVibePhotos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80',
    ],
  },
  'match-mai': {
    id: 'match-mai',
    bio: 'Minimal life, yoga sang, va rat me chill vibe nhu am thanh bien dem.',
    distanceKm: 1,
    interests: ['Yoga', 'Minimal', 'Sunset'],
    recentVibePhotos: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80',
    ],
  },
};

export const getMatchProfileDetail = (id: string): MatchProfileDetail => {
  return matchProfileById[id] || {
    ...defaultProfileDetail,
    id,
  };
};
