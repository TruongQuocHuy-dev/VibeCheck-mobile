import { MatchInfo } from '../domain/types/match.types';

export const mockMatchInfo: MatchInfo = {
  id: 'm1',
  userName: 'You',
  userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  matchName: 'Alex',
  matchAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
  matchedAt: new Date().toISOString(),
};
