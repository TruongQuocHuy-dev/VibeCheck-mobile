import { useState, useEffect } from 'react';
import { UseProfileSetupReturn } from '../../domain/types/profile-setup.types';
import { ProfileService } from '../../infrastructure/services/profile.service';
import { profileSchema } from '../../domain/validators/profile.validator';
import { getUser, saveUser } from '../../../../infrastructure/storage/AsyncStorage';
import { launchImageLibrary } from 'react-native-image-picker';

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
  const [errors, setErrors] = useState<{ nickname?: string; birthYear?: string }>({});

  // Real-time validation effect
  useEffect(() => {
    const newErrors: { nickname?: string; birthYear?: string } = {};

    const nickCheck = profileSchema.shape.nickname.safeParse(nickname);
    if (!nickCheck.success && nickname.length > 0) {
      newErrors.nickname = nickCheck.error.issues[0].message;
    }

    const birthCheck = profileSchema.shape.birthYear.safeParse(birthYear);
    if (!birthCheck.success && birthYear.length > 0) {
      newErrors.birthYear = birthCheck.error.issues[0].message;
    }

    setErrors(newErrors);
  }, [nickname, birthYear]);

  const handlePickAvatar = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets[0].uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log('[useProfileSetup] Image picking error:', err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Validate with Zod
      profileSchema.parse({ nickname, birthYear, avatarUri });
      
      await ProfileService.createProfile({ nickname, birthYear, avatarUri });
      
      try {
        const user = await getUser();
        if (user) {
          await saveUser({ ...user, isProfileComplete: true });
        }
      } catch (e) {
        console.log('Hydration save error:', e);
      }

      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      if (err.errors && err.errors[0]) {
        // Safe Zod unwrap error
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
    errors,
    loading,
    error,
  };
};
