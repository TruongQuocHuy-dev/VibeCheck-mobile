export const typography = Object.freeze({
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    heavy: '800',
  },
} as const);

export type TypographySizeKey = keyof typeof typography.sizes;
export type TypographyWeightKey = keyof typeof typography.weights;
