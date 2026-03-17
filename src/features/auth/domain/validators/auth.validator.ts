/**
 * Domain Validator for Authentication inputs.
 */
export const AuthValidator = {
  /**
   * Validates Vietnam Phone structure length.
   */
  validatePhone: (phoneNumber: string): boolean => {
    const sanitized = phoneNumber.replace(/\s/g, '');
    return sanitized.length >= 9 && sanitized.length <= 11;
  },

  /**
   * Validates Otp slot length matches setup.
   */
  validateOtp: (otp: string, length: number = 4): boolean => {
    return otp.length === length;
  },

  /**
   * Validates standard setup password length buffer.
   */
  validatePassword: (password: string, min: number = 4): boolean => {
    return password.length >= min;
  },
};
