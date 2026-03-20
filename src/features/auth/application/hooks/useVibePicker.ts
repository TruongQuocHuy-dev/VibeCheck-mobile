import { useState, useEffect } from 'react';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';

export const useVibePicker = (onComplete?: () => void) => {
  const [vibes, setVibes] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadVibes = async () => {
      setLoading(true);
      try {
        const res: any = await apiClient.get(ENDPOINTS.VIBES.GET_ALL);
        setVibes(res.vibes || []);
      } catch (err) {
        console.log('Error loading vibes:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVibes();
  }, []);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      if (selectedIds.length < 5) {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  const handleReset = () => setSelectedIds([]);

  const isValid = selectedIds.length >= 3 && selectedIds.length <= 5;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await apiClient.post(ENDPOINTS.USER.UPDATE_VIBES, { vibes: selectedIds });
      if (onComplete) onComplete();
    } catch (err) {
      console.log('Error saving vibes:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    vibes,
    selectedIds,
    toggleSelection,
    handleReset,
    isValid,
    handleSubmit,
    loading,
  };
};
