export interface NewMatchUser {
  id: string;
  name: string;
  age: number;
  avatar: string;
  isOnline?: boolean;
  isNew?: boolean;
}

export interface MatchVibeStory {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  backgroundImage: string;
  expiresIn: string;
  hasMusic?: boolean;
  hasLocation?: boolean;
  stories?: any[];
}

export interface LockedLikeUser {
  id: string;
  avatar: string;
}

export interface MatchesScreenData {
  newMatches: NewMatchUser[];
  matchVibes: MatchVibeStory[];
  ownVibeStories?: any[];
  lockedLikes: LockedLikeUser[];
  totalLockedLikes: number;
}

export interface MatchProfileDetail {
  id: string;
  bio: string;
  distanceKm: number;
  interests: string[];
  recentVibePhotos: string[];
}
