/**
 * AuthService handling simulated authentication operations.
 * To be replaced with real standard API/SDK calls later.
 */
export const AuthService = {
  /**
   * Check if user account exists with number.
   */
  checkUserExists: async (phoneNumber: string): Promise<boolean> => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
    const sanitized = phoneNumber.replace(/\s/g, '');
    return sanitized === '0987654321';
  },

  /**
   * Triggers OTP dispatch workflow.
   */
  sendOtp: async (phoneNumber: string): Promise<void> => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
    console.log(`[AuthService] OTP dispatched to ${phoneNumber}`);
  },

  /**
   * Verify verification OTP code.
   */
  verifyOtp: async (phoneNumber: string, otp: string): Promise<boolean> => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
    return otp === '1234';
  },

  /**
   * Standard password login simulation.
   */
  loginWithPassword: async (phoneNumber: string, password: string): Promise<boolean> => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
    return password === '1234';
  },
};
