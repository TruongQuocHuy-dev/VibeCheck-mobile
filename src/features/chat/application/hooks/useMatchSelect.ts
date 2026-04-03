import { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { NewMatchUser } from '../../../../features/matches/domain/types/matches.types';
import { mapMatchData } from '../../../../features/matches/application/hooks/matches.mapper';

export const useMatchSelect = (onSelect: (user: NewMatchUser) => void) => {
  const [matches, setMatches] = useState<NewMatchUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await apiClient.get(ENDPOINTS.SWIPES.MATCHES);
      const rawMatches = Array.isArray(res) ? res : res?.data || [];
      const mapped = mapMatchData(rawMatches);
      
      // Unique matches only
      const unique = mapped.filter((item, index, arr) => {
        return arr.findIndex((x) => x.id === item.id) === index;
      });
      
      setMatches(unique);
    } catch (err) {
      console.error('[useMatchSelect] Fetch matches error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return matches;
    return matches.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [matches, searchQuery]);

  return {
    matches: filteredMatches,
    loading,
    searchQuery,
    setSearchQuery,
    refresh: fetchMatches,
    handleSelect: onSelect,
  };
};
