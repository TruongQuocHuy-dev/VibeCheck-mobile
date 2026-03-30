import { VibeDetailData } from '../domain/types/vibe-detail.types';

/**
 * Mặc định cho chi tiết Vibe (Không sử dụng Mock Data)
 * Các trường Stats, Bình luận, Cảm xúc sẽ được trả về từ Backend.
 */
export const vibeDetailMockData: VibeDetailData = {
  id: '',
  caption: '',
  location: '',
  expiresAt: '',
  backgroundImage: '',
  ownerName: '',
  ownerAvatar: '',
  track: {
    title: '',
    artist: '',
  },
  stats: [],
  reactions: [],
  comments: [],
};
