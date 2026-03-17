/**
 * Interface representing a Vibe Card in the Discovery/Radar feed.
 */
export interface VibeCard {
  id: string;
  type: 'song' | 'status' | 'location';
  title: string;
  subtitle: string;
  location: string;
  distance: string;
  avatar?: string;
  backgroundColor?: string;
}
