export const spacing = Object.freeze({
  xs: 4,
  sm: 8,
  sm_md: 10,
  md_sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const);

export type SpacingKey = keyof typeof spacing;

export const borderRadius = Object.freeze({
  sm: 8,
  md: 12,
  lg: 20,
  xl: 30,
  xxl: 40,
  radius_pill: 34,
  radius_modal: 20,
  full: 9999,
} as const);

export type BorderRadiusKey = keyof typeof borderRadius;

export const sizes = Object.freeze({
  iconHeart: 80,
  iconAccent: 24,
  iconCall: 20,
  iconBack: 28,
  wrapper: 180,
  glass: 160,
  glassRadius: 40,
  button: 56,
  googleLogo: 20,
} as const);

export type SizeKey = keyof typeof sizes;
