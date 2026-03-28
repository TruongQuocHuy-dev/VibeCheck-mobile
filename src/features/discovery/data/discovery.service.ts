import apiClient from '../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../infrastructure/api/endpoints';
import type { Candidate, MatchResult, DiscoveryFilters } from '../domain/types/vibe-card.types';

/**
 * Fetch candidate users for the swipe feed.
 * Backend excludes users already swiped by current user.
 */
export const fetchCandidates = async (filters?: DiscoveryFilters): Promise<Candidate[]> => {
  const params = {
    minAge: filters?.minAge ?? 18,
    maxAge: filters?.maxAge ?? 40,
    gender: filters?.gender && filters.gender !== 'all' ? filters.gender : undefined,
  };

  const data = await apiClient.get<any, Candidate[]>(ENDPOINTS.SWIPES.CANDIDATES, { params });
  return data;
};

export const fetchCandidatesEstimate = async (filters: DiscoveryFilters): Promise<number> => {
  const params = {
    minAge: filters.minAge,
    maxAge: filters.maxAge,
    gender: filters.gender !== 'all' ? filters.gender : undefined,
  };

  const data = await apiClient.get<any, { estimatedCount: number }>(
    ENDPOINTS.SWIPES.CANDIDATES_ESTIMATE,
    { params }
  );

  return data.estimatedCount;
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

export const undoDislikeSwipe = async (swipedId: string): Promise<{ undone: boolean }> => {
  const data = await apiClient.delete<any, { undone: boolean }>(ENDPOINTS.SWIPES.UNDO_DISLIKE(swipedId));
  return data;
};

export const blockCandidate = async (blockedUserId: string): Promise<{ blocked: boolean }> => {
  const data = await apiClient.post<any, { blocked: boolean }>(ENDPOINTS.SWIPES.BLOCK, {
    blockedUserId,
  });
  return data;
};

export const reportCandidate = async (
  reportedUserId: string,
  reason = 'other',
  note?: string
): Promise<{ reported: boolean }> => {
  const data = await apiClient.post<any, { reported: boolean }>(ENDPOINTS.SWIPES.REPORT, {
    reportedUserId,
    reason,
    note,
  });
  return data;
};
