import { useState } from 'react';
import { UseProfileSetupReturn } from '../../domain/types/profile-setup.types';
import { ProfileService } from '../../infrastructure/services/profile.service';
import { profileSchema } from '../../domain/validators/profile.validator';

/**
 * Custom hook managing the state of the ProfileSetup Screen workflows.
 * @param onComplete - callback executed upon successful form submission.
 */
export const useProfileSetup = (onComplete?: () => void): UseProfileSetupReturn => {
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickAvatar = () => {
    setAvatarUri(ProfileService.getMockAvatar());
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Validate with Zod
      profileSchema.parse({ nickname, birthYear, avatarUri });
      
      await ProfileService.createProfile({ nickname, birthYear, avatarUri });
      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      if (err.errors && err.errors[0]) {
        setError(err.errors[0].message);
      } else {
        setError(err.message || 'Lỗi tạo hồ sơ');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    nickname,
    birthYear,
    avatarUri,
    setNickname,
    setBirthYear,
    handlePickAvatar,
    handleSubmit,
    loading,
    error,
  };
};
