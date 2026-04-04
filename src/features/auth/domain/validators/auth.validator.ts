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
   * Validates password complexity: min 8, uppercase, lowercase, number and special char.
   */
  validatePassword: (password: string, min: number = 8): { isValid: boolean; message?: string } => {
    if (password.length < min) {
      return { isValid: false, message: `Mật khẩu phải có ít nhất ${min} ký tự.` };
    }
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    
    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial) {
      return { 
        isValid: false, 
        message: 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*).' 
      };
    }
    
    return { isValid: true };
  },
};
