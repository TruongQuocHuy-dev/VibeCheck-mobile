/**
 * Props for the OtpScreen component.
 */
export interface OtpScreenProps {
  /**
   * Callback executed upon successful login/verification.
   */
  onLoginSuccess?: () => void;
}

/**
 * Return interface for the useOtpForm custom hook.
 */
export interface UseOtpFormReturn {
  /** Current step in the authentication flow */
  step: 'PHONE' | 'OTP' | 'PASSWORD';
  /** User inputted phone number string */
  phoneNumber: string;
  /** User inputted 4-digit OTP buffer */
  otp: string;
  /** User inputted password buffer for existing users */
  password?: string;
  /** Countdown timer secs for Resend OTP action */
  timer: number;
  /** Set state trigger for switching views */
  setStep: (step: 'PHONE' | 'OTP' | 'PASSWORD') => void;
  /** Callback to push keys from numerical keypad */
  handleKeyPress: (key: string) => void;
  /** Callback when pressing continue button trigger */
  handleContinue: () => void;
  /** Resend OTP trigger callback */
  resendOtp: () => void;
}

