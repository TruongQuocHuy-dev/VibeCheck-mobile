import apiClient from '../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../infrastructure/api/endpoints';
import type { Candidate, MatchResult } from '../domain/types/vibe-card.types';

/**
 * Fetch candidate users for the swipe feed.
 * Backend excludes users already swiped by current user.
 */
export const fetchCandidates = async (): Promise<Candidate[]> => {
  const data = await apiClient.get<any, Candidate[]>(ENDPOINTS.SWIPES.CANDIDATES);
  return data;
};

/**
 * Submit a swipe action.
 * Returns whether this swipe resulted in a match.
 */
export const submitSwipe = async (
  swipedId: string,
  type: 'like' | 'dislike'
): Promise<MatchResult> => {
  const data = await apiClient.post<any, MatchResult>(ENDPOINTS.SWIPES.CREATE, {
    swipedId,
    type,
  });
  return data;
};
