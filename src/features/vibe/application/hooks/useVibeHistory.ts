import { useState, useCallback, useEffect } from 'react';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { VibeStory } from '../../domain/types/vibe-detail.types';
import { useProfile } from '../../../../features/profile/application/hooks/useProfile';
import { VIBE_HISTORY_MOCK } from '../../data/vibe-history.data';

export const useVibeHistory = (userId?: string) => {
  const { ownProfileData } = useProfile();
  const targetUserId = userId || ownProfileData?._id || ownProfileData?.id;

  const [stories, setStories] = useState<VibeStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (isRefreshing = false) => {
    if (!targetUserId) return;

    if (isRefreshing) setRefreshing(true);
    else setLoading(true);
    
    setError(null);

    try {
      // In a real app, we fetch from API
      // For now, we mix API call with fallback to mock if API fails or for demo
      const response: any = await apiClient.get(ENDPOINTS.VIBE_STORIES.USER_HISTORY(targetUserId));
      
      if (response && response.stories) {
        setStories(response.stories);
      } else {
        // Fallback to mock for development/demo purposes
        setStories(VIBE_HISTORY_MOCK as any);
      }
    } catch (e: any) {
      console.error('[useVibeHistory] Fetch error:', e);
      setError(e.message || 'Không thể tải lịch sử Vibe');
      // Fallback to mock anyway if in development
      setStories(VIBE_HISTORY_MOCK as any);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    stories,
    loading,
    refreshing,
    error,
    refresh: () => fetchHistory(true),
  };
};
