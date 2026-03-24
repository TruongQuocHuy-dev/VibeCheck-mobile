import { useState, useEffect } from 'react';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';

export interface VibeTag {
  _id: string;
  label: string;
  emoji: string;
  colorType: 'cyan' | 'pink';
}

// Module-level cache — fetched once for the app session
let cache: VibeTag[] | null = null;

/**
 * Fetches the global VibeTag list from the backend once per session.
 * Used to resolve vibe _id strings → emoji + label for display.
 */
export const useVibeTags = () => {
  const [vibeTags, setVibeTags] = useState<VibeTag[]>(cache ?? []);

  useEffect(() => {
    if (cache) return; // already fetched
    apiClient
      .get<any, any>(ENDPOINTS.VIBES.GET_ALL)
      .then((res: any) => {
        const tags: VibeTag[] = res?.vibes ?? res ?? [];
        cache = tags;
        setVibeTags(tags);
      })
      .catch(() => {
        // Non-critical — vibe tags will just show raw string fallback
      });
  }, []);

  /**
   * Map vibe _id or label strings to display objects { text, colorType }.
   * Falls back to { text: id, colorType: 'cyan' } if not found.
   */
  const resolveVibes = (vibeIds: string[]): Array<{ text: string; colorType: 'cyan' | 'pink' }> =>
    vibeIds.map((id) => {
      const tag = vibeTags.find((t) => t._id === id);
      return tag
        ? { text: `${tag.emoji} ${tag.label}`, colorType: tag.colorType }
        : { text: id, colorType: 'cyan' as const };
    });

  return { vibeTags, resolveVibes };
};
