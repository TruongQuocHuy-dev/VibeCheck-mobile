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
  /** User's full name */
  fullName: string;
  /** User's typed nickname/alias */
  nickname: string;
  /** Gender value */
  gender: 'male' | 'female' | '';
  /** User's typed birth year string */
  birthYear: string;
  /** Selected avatar URI from picker */
  avatarUri?: string;
  /** Set state trigger for full name */
  setFullName: (val: string) => void;
  /** Set state trigger for nickname */
  setNickname: (val: string) => void;
  /** Set state trigger for gender */
  setGender: (val: 'male' | 'female') => void;
  /** Set state trigger for birth year */
  setBirthYear: (val: string) => void;
  /** Open image picker trigger callback */
  handlePickAvatar: () => void;
  /** Submit profile completion trigger */
  handleSubmit: () => void;
  /** Separate field-level error messages for real-time feedback */
  errors: { fullName?: string; nickname?: string; gender?: string; birthYear?: string };
  /** Form validity flag */
  isFormValid: boolean;
  /** Error message if validation or submit fails */
  error: string | null;
  /** Loading state during submit */
  loading: boolean;
}
