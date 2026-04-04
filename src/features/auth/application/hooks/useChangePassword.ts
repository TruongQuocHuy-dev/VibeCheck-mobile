import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { ChangePasswordFormData } from '../../domain/types/change-password.types';
import { getUser, saveUser } from '../../../../infrastructure/storage/AsyncStorage';
import { AuthValidator } from '../../domain/validators/auth.validator';

export const useChangePassword = () => {
  const navigation = useNavigation<any>();
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user: any = await getUser();
        setHasPassword(!!user?.hasPassword);
      } catch (err) {
        setHasPassword(false);
      }
    };
    checkUser();
  }, []);

  const handleInputChange = useCallback((field: keyof ChangePasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  }, [error]);

  // Real-time validation checks for newPassword
  const passwordStatus = useMemo(() => {
    const pass = formData.newPassword;
    return {
      length: pass.length >= 8,
      lowercase: /[a-z]/.test(pass),
      uppercase: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*]/.test(pass),
    };
  }, [formData.newPassword]);

  const validate = () => {
    // If hasPassword is true, oldPassword is required
    if (hasPassword && !formData.oldPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại.');
      return false;
    }
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ mật khẩu mới.');
      return false;
    }
    
    // Check complexity using domain validator
    const passwordValidation = AuthValidator.validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message || 'Mật khẩu không hợp lệ.');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      if (hasPassword) {
        await AuthService.changePassword(formData);
      } else {
        // If no password yet, use setPassword
        await AuthService.setPassword(formData.newPassword);
        
        // Update local user state
        const user: any = await getUser();
        if (user) {
          await saveUser({ ...user, hasPassword: true });
        }
      }
      setIsSuccess(true);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Đã có lỗi xảy ra.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [formData, hasPassword]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    hasPassword,
    formData,
    isLoading,
    error,
    isSuccess,
    passwordStatus,
    handleInputChange,
    handleSubmit,
    handleBack,
  };
};
