export interface UserStat {
  id: string;
  label: string;
  value: number;
}

export interface CurrentVibe {
  id: string;
  text: string;
  expiresIn: string;
  backgroundImage: string;
}

export interface PremiumPlan {
  id: string;
  title: string;
  perks: string[];
  ctaLabel: string;
}

export interface PastVibeItem {
  id: string;
  image: string;
  statusLabel: string;
}

export interface UserProfile {
  id: string;
  username: string;
  handle: string;
  avatar: string;
  isVerified: boolean;
  bio?: string;
  stats: UserStat[];
  currentVibe?: CurrentVibe;
  premiumPlan: PremiumPlan;
  pastVibes: PastVibeItem[];
  blockedByMe?: boolean;
}
