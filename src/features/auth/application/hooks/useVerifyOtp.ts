import { useState } from 'react';
import { FirebaseService, PhoneConfirmation } from '../../../../infrastructure/services/firebase.service';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { saveTokens, saveUser } from '../../../../infrastructure/storage/AsyncStorage';
import { otpSchema } from '../../domain/validators/otp.validator';

interface VerifyResult {
  isNewUser: boolean;
  hasPassword: boolean;
  isProfileComplete: boolean;
}

/**
 * Use case: verify OTP, exchange Firebase idToken with backend, receive app JWT.
 */
export const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOtp = async (
    confirmation: PhoneConfirmation,
    code: string
  ): Promise<VerifyResult | null> => {
    setLoading(true);
    setError(null);
    try {
      otpSchema.parse(code);

      // 1. Verify with Firebase
      await FirebaseService.verifyOtp(confirmation, code);

      // 2. Get Firebase ID token
      const idToken = await FirebaseService.getIdToken();
      if (!idToken) throw new Error('Không lấy được token từ Firebase.');

      // 3. Send to backend → receive app JWT
      const result = await AuthService.register(idToken);

      // 4. Persist tokens locally
      await saveTokens(result.accessToken, result.refreshToken);
      await saveUser({
        ...result.user,
        hasPassword: result.hasPassword,
        isProfileComplete: result.isProfileComplete,
      });

      return {
        isNewUser: result.isNewUser,
        hasPassword: result.hasPassword,
        isProfileComplete: result.isProfileComplete,
      };
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || 'Mã OTP không chính xác');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { verifyOtp, loading, error };
};
