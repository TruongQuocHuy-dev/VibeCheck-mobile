/**
 * Interface representing a Vibe Card in the Discovery/Radar feed.
 * Used for mock data compatibility.
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

/**
 * Real backend candidate (user) shape for the Discovery swipe feed.
 */
export interface Candidate {
  _id: string;
  fullName?: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  vibes: string[];
  birthYear: number | null;
  photos: string[];  // Extra photos for card detail
  hasLikedMe?: boolean;
}

/**
 * Payload returned when creating a swipe that results in a match.
 */
export interface MatchResult {
  isMatch: boolean;
  match: {
    conversationId: string;
    matchedUser: {
      _id: string;
      fullName?: string;
      displayName: string;
      avatar: string | null;
    };
  } | null;
}


