import { ViewStyle, TextStyle } from 'react-native';

/** Props interface for BorderInput atom component */
export interface BorderInputProps {
  /** Input current value */
  value: string;
  /** Callback when text is typed */
  onChangeText: (text: string) => void;
  /** Placeholder text placeholder */
  placeholder?: string;
  /** Name for left icon rendering */
  iconName?: string;
  /** Safe boolean toggle text visibility security */
  secureTextEntry?: boolean;
  /** Standard React Native string keyboards layouts triggers */
  keyboardType?: 'default' | 'number-pad' | 'email-address' | 'numeric';
  /** Limits values numeric length constraints */
  maxLength?: number;
  /** Overriding container wrapper styles object specs */
  style?: ViewStyle;
  /** Outer nested TextInput specifications styles specs */
  inputStyle?: TextStyle;
  /** Color string override specifications overlay standard streams */
  iconColor?: string;
  /** Testing identifier automated workflows frame sets */
  testID?: string;
  /** Readonly boolean states controlling triggers setups rules */
  editable?: boolean;
}
