import { useState } from 'react';
import { AuthApiService } from '../../../../infrastructure/services/auth.api.service';
import { saveTokens, saveUser } from '../../../../infrastructure/storage/AsyncStorage';
import { passwordSchema } from '../../domain/validators/otp.validator';

/**
 * Use case: login with phone + password for returning users.
 */
export const useLoginPassword = (onSuccess: (result: any) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (phone: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      passwordSchema.parse(password);
      const result = await AuthApiService.login(phone, password);
      await saveTokens(result.accessToken, result.refreshToken);
      await saveUser({
        ...result.user,
        hasPassword: true, // Login implies password exists
        isProfileComplete: result.isProfileComplete,
      });
      onSuccess(result);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || 'Sai thông tin đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
