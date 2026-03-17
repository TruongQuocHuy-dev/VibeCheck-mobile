import { useState } from 'react';
import { AuthService } from '../../infrastructure/services/auth.service';
import { phoneSchema } from '../../domain/validators/otp.validator';

/**
 * Use case hook for triggering OTP send workflow.
 */
export const useSendOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = async (phone: string, onStepChange: () => void) => {
    setLoading(true);
    setError(null);
    try {
      phoneSchema.parse(phone); // Validation
      const { exists } = await AuthService.checkUser(phone);
      if (exists) {
        return 'PASSWORD'; // Tell caller to switch to PASSWORD
      } else {
        await AuthService.sendOtp(phone);
        onStepChange(); // Switch to OTP
        return 'OTP';
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || 'Lỗi gửi mã OTP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, loading, error };
};
