import { colors } from './colors';

/**
 * Reusable shadow tokens cho VibeCheck app - NO FALLBACKS
 * 
 * UI-specific shadow styling used across the app
 */

export const shadows = Object.freeze({
  glass: {
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  glow: {
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  accent: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
} as const);

export const textShadows = Object.freeze({
  neon: {
    textShadowColor: 'rgba(242, 13, 128, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
} as const);

export type ShadowKey = keyof typeof shadows;
export type TextShadowKey = keyof typeof textShadows;
