/** Props interface for PhoneInput molecule component */
export interface PhoneInputProps {
  /** Phone number value string setups */
  value: string;
  /** Callback execution when absolute overlap pressed setups rules */
  onChangeText: (text: string) => void;
  /** Inner nested input label placeholder override strings trigger */
  placeholder?: string;
  /** Readonly boolean states controlling triggers setups rules */
  editable?: boolean;
  /** Testing identifier automated workflows frame sets */
  testID?: string;
}

