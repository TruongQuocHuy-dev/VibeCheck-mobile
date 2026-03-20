export interface OtpInputGroupProps {
  /** Otp value string setups */
  otp: string;
  /** Callback updates the otp text state */
  setOtp: (otp: string) => void;
  /** Length number setup optional overrides default 4 arrays */
  length?: number;
}
