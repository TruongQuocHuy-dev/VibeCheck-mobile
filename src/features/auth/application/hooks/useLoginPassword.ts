import { useState } from 'react';
import { AuthService } from '../../infrastructure/services/auth.service';
import { passwordSchema } from '../../domain/validators/otp.validator';

/**
 * Use case hook for password login authentication.
 */
export const useLoginPassword = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (phone: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      passwordSchema.parse(password); // Validation
      const { token } = await AuthService.login(phone, password);
      if (token) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || err.message || 'Sai thông tin đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
