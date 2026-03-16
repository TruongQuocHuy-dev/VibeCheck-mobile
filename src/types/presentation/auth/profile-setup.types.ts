/**
 * Props for the ProfileSetupScreen component.
 */
export interface ProfileSetupScreenProps {
  /**
   * Callback executed upon successful profile completion.
   */
  onComplete?: () => void;
}

/**
 * Return interface for the useProfileSetup custom hook.
 */
export interface UseProfileSetupReturn {
  /** User's typed nickname/alias */
  nickname: string;
  /** User's typed birth year string */
  birthYear: string;
  /** Selected avatar URI from picker */
  avatarUri?: string;
  /** Set state trigger for nickname */
  setNickname: (val: string) => void;
  /** Set state trigger for birth year */
  setBirthYear: (val: string) => void;
  /** Open image picker trigger callback */
  handlePickAvatar: () => void;
  /** Submit profile completion trigger */
  handleSubmit: () => void;
}
