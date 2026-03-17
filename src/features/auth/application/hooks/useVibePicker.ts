import { useState } from 'react';

export const useVibePicker = (onComplete?: () => void) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '3', '6']); // Mặc định từ mock

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

  const handleSubmit = () => {
    if (isValid && onComplete) {
      onComplete();
    }
  };

  return {
    selectedIds,
    toggleSelection,
    handleReset,
    isValid,
    handleSubmit,
  };
};
