import { useState } from 'react';
import { VibeCard } from '../../domain/types/vibe-card.types';
import { mockVibeCards } from '../../data/vibe-card.data';

export const useDiscovery = () => {
  const [cards, setCards] = useState<VibeCard[]>(mockVibeCards);

  const handleLike = (id: string) => {
    console.log(`Liked card: ${id}`);
    // Handle local list removes or animations
  };

  const handleSkip = (id: string) => {
    console.log(`Skipped card: ${id}`);
  };

  return {
    cards,
    handleLike,
    handleSkip,
  };
};
