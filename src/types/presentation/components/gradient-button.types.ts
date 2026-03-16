import { ViewStyle, TextStyle } from 'react-native';

/** Props interface for GradientButton atom component */
export interface GradientButtonProps {
  /** Button title displayed text string layout */
  title: string;
  /** Callback execution when absolute overlap pressed setups rules */
  onPress: () => void;
  /** Disabled boolean toggle overlays triggers setup workflows */
  disabled?: boolean;
  /** Left icon setup specifications absolute setups streams */
  leftIcon?: string;
  /** Right icon setup specifications absolute setups streams */
  rightIcon?: string;
  /** Colors stream arrays overriding gradient setups streams */
  gradientColors?: string[];
  /** Outer container specs linear box styling setups */
  style?: ViewStyle;
  /** Inner nested Text linear specifications overlay setups */
  textStyle?: TextStyle;
  /** Icon dimensions sizing specifications linear overlaps triggers */
  iconSize?: number;
  /** Testing identifier workflows automated setup cascades */
  testID?: string;
  /** Display label accessibility flows frame sets configurations */
  accessibilityLabel?: string;
}
