export const spacing = {
  xs: 4,
  sm: 8,
  sm_md: 10, // Added to prevent arithmetic +6
  md_sm: 12, // For mid-range spacing
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 30,
  full: 9999,
} as const;

export const sizes = {
  iconHeart: 80,
  iconAccent: 24,
  iconCall: 20,
  iconBack: 28, // Added for Header Back Buttons
  wrapper: 180,
  glass: 160,
  glassRadius: 40, // Added to prevent inline radius hardcodes
  button: 56,
  googleLogo: 20,
} as const;



