import { useState, useRef } from 'react';
import { FirebaseService, PhoneConfirmation } from '../../../../infrastructure/services/firebase.service';
import { phoneSchema } from '../../domain/validators/otp.validator';

/**
 * Use case: send OTP to phone via Firebase.
 * Returns confirmation ref used later for verify step.
 */
export const useSendOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationRef = useRef<PhoneConfirmation | null>(null);

  const sendOtp = async (phone: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      phoneSchema.parse(phone);
      const confirmation = await FirebaseService.sendOtp(phone);
      confirmationRef.current = confirmation;
      return true;
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || 'Không thể gửi mã OTP');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, loading, error, confirmationRef };
};
