import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCandidates, submitSwipe } from '../../data/discovery.service';
import type { Candidate, MatchResult, DiscoveryFilters } from '../../domain/types/vibe-card.types';
import { onSocketEvent, offSocketEvent } from '../../../../infrastructure/services/socket.service';

interface UseDiscoveryReturn {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  currentCandidate: Candidate | undefined;
  matchResult: MatchResult | null;
  filters: DiscoveryFilters;
  isSwiping: boolean;
  handleLike: () => Promise<void>;
  handleSkip: () => Promise<void>;
  updateFilters: (nextFilters: DiscoveryFilters) => void;
  refreshCandidates: (silent?: boolean) => Promise<void>;
  dismissMatch: () => void;
}

export const useDiscovery = (): UseDiscoveryReturn => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matchQueue, setMatchQueue] = useState<NonNullable<MatchResult['match']>[]>([]);
  const [filters, setFilters] = useState<DiscoveryFilters>({ minAge: 18, maxAge: 40, gender: 'all' });
  const [isSwiping, setIsSwiping] = useState(false);
  const isFetchingRef = useRef(false);
  const lastSilentFetchAtRef = useRef(0);

  const currentCandidate = candidates[0];

  const isSameCandidateList = useCallback((prev: Candidate[], next: Candidate[]) => {
    if (prev.length !== next.length) return false;
    for (let i = 0; i < prev.length; i += 1) {
      if (prev[i]?._id !== next[i]?._id) {
        return false;
      }
    }
    return true;
  }, []);

  const loadCandidates = useCallback(async (silent = false, force = false) => {
    if (isFetchingRef.current) {
      return;
    }

    if (silent && !force) {
      const now = Date.now();
      // Cooldown silent refreshes to protect server at scale.
      if (now - lastSilentFetchAtRef.current < 20000) {
        return;
      }
      lastSilentFetchAtRef.current = now;
    }

    isFetchingRef.current = true;

    if (!silent) {
      setLoading(true);
    }

    if (!silent) {
      setError(null);
    }

    try {
      const data = await fetchCandidates(filters);
      setCandidates((prev) => (isSameCandidateList(prev, data) ? prev : data));
    } catch (err: any) {
      setError(err?.message ?? 'Không thể tải danh sách.');
    } finally {
      isFetchingRef.current = false;
      if (!silent) {
        setLoading(false);
      }
    }
  }, [isSameCandidateList, filters]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const enqueueMatch = useCallback((match: MatchResult['match']) => {
    if (!match) return;

    setMatchQueue((prev) => {
      const existsInQueue = prev.some((item) => item.conversationId === match.conversationId);
      const isCurrent = matchResult?.match?.conversationId === match.conversationId;

      if (existsInQueue || isCurrent) {
        return prev;
      }

      return [...prev, match];
    });
  }, [matchResult?.match?.conversationId]);

  useEffect(() => {
    if (!matchResult && matchQueue.length > 0) {
      setMatchResult({ isMatch: true, match: matchQueue[0] });
    }
  }, [matchResult, matchQueue]);

  useEffect(() => {
    const handleNewMatch = (payload: MatchResult['match']) => {
      if (!payload) return;
      enqueueMatch(payload);
    };

    onSocketEvent<MatchResult['match']>('new_match', handleNewMatch);

    return () => {
      offSocketEvent<MatchResult['match']>('new_match', handleNewMatch);
    };
  }, [enqueueMatch]);

  const swipe = useCallback(async (type: 'like' | 'dislike') => {
    if (!currentCandidate || isSwiping) return;

    setIsSwiping(true);
    try {
      const result = await submitSwipe(currentCandidate._id, type);

      // Remove swiped candidate
      setCandidates((prev) => prev.slice(1));

      if (result.isMatch && result.match) {
        console.log('Discovery: MATCH DETECTED!', result.match);
        enqueueMatch(result.match);
      } else {
        console.log('Discovery: No match for this swipe.');
      }

      // Re-fetch if queue is getting low
      if (candidates.length <= 2) {
        loadCandidates(true, true);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Lỗi kết nối.');
    } finally {
      setIsSwiping(false);
    }
  }, [currentCandidate, isSwiping, candidates.length, loadCandidates, enqueueMatch]);

  const handleLike = useCallback(() => swipe('like'), [swipe]);
  const handleSkip = useCallback(() => swipe('dislike'), [swipe]);
  const updateFilters = useCallback((nextFilters: DiscoveryFilters) => {
    const normalizedMin = Math.max(18, nextFilters.minAge);
    const normalizedMax = Math.max(normalizedMin + 1, nextFilters.maxAge || 40);
    const normalized: DiscoveryFilters = {
      minAge: normalizedMin,
      maxAge: normalizedMax,
      gender: nextFilters.gender,
    };

    setFilters((prev) => {
      if (
        prev.gender === normalized.gender
        && prev.minAge === normalized.minAge
        && prev.maxAge === normalized.maxAge
      ) {
        return prev;
      }

      return normalized;
    });
  }, []);
  const refreshCandidates = useCallback((silent = true) => loadCandidates(silent), [loadCandidates]);
  const dismissMatch = useCallback(() => {
    setMatchResult(null);
    setMatchQueue((prev) => prev.slice(1));
  }, []);

  return {
    candidates,
    loading,
    error,
    currentCandidate,
    matchResult,
    filters,
    isSwiping,
    handleLike,
    handleSkip,
    updateFilters,
    refreshCandidates,
    dismissMatch,
  };
};
