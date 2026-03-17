/** Props interface for AvatarPicker molecule component */
export interface AvatarPickerProps {
  /** Selected avatar URI or null/undefined */
  avatarUri?: string | null;
  /** Callback to pick/upload avatar */
  onPickAvatar: () => void;
  /** Test identifier */
  testID?: string;
}
