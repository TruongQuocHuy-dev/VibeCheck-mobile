import { colors } from '../../../core/theme/colors';

export interface VibeFilter {
  id: string;
  name: string;
  icon: string;
  colors: readonly [string, string];
  opacity: number;
}

export const VIBE_FILTERS: VibeFilter[] = [
  {
    id: 'vintage',
    name: 'Vintage',
    icon: 'grain',
    colors: [colors.filterVintageStart, colors.filterVintageEnd],
    opacity: 1,
  },
  {
    id: 'exposure',
    name: 'Sáng',
    icon: 'white-balance-sunny',
    colors: [colors.filterExposureStart, colors.filterExposureEnd],
    opacity: 1,
  },
  {
    id: 'auto',
    name: 'Auto',
    icon: 'magic-staff',
    colors: [colors.filterAutoStart, colors.filterAutoEnd],
    opacity: 1,
  },
];
