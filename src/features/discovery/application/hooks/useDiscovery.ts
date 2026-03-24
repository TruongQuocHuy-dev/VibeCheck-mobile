import { useState, useEffect, useCallback } from 'react';
import { fetchCandidates, submitSwipe } from '../../data/discovery.service';
import type { Candidate, MatchResult } from '../../domain/types/vibe-card.types';

interface UseDiscoveryReturn {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  currentCandidate: Candidate | undefined;
  matchResult: MatchResult | null;
  isSwiping: boolean;
  handleLike: () => Promise<void>;
  handleSkip: () => Promise<void>;
  dismissMatch: () => void;
}

export const useDiscovery = (): UseDiscoveryReturn => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const currentCandidate = candidates[0];

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCandidates();
      setCandidates(data);
    } catch (err: any) {
      setError(err?.message ?? 'Không thể tải danh sách.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const swipe = useCallback(async (type: 'like' | 'dislike') => {
    if (!currentCandidate || isSwiping) return;

    setIsSwiping(true);
    try {
      const result = await submitSwipe(currentCandidate._id, type);

      // Remove swiped candidate
      setCandidates((prev) => prev.slice(1));

      if (result.isMatch && result.match) {
        setMatchResult(result);
      }

      // Re-fetch if queue is getting low
      if (candidates.length <= 2) {
        loadCandidates();
      }
    } catch (err: any) {
      setError(err?.message ?? 'Lỗi kết nối.');
    } finally {
      setIsSwiping(false);
    }
  }, [currentCandidate, isSwiping, candidates.length, loadCandidates]);

  const handleLike = useCallback(() => swipe('like'), [swipe]);
  const handleSkip = useCallback(() => swipe('dislike'), [swipe]);
  const dismissMatch = useCallback(() => setMatchResult(null), []);

  return {
    candidates,
    loading,
    error,
    currentCandidate,
    matchResult,
    isSwiping,
    handleLike,
    handleSkip,
    dismissMatch,
  };
};
