import { useState } from 'react';
import { AuthService } from '../../infrastructure/services/auth.service';
import { otpSchema } from '../../domain/validators/otp.validator';

/**
 * Use case hook for verifying OTP authentication.
 */
export const useVerifyOtp = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOtp = async (phone: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      otpSchema.parse(otp); // Validation
      const { token } = await AuthService.verifyOtp(phone, otp);
      if (token) {
        // Save token to state/storage here if needed
        onSuccess();
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || 'Mã OTP không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading, error };
};
