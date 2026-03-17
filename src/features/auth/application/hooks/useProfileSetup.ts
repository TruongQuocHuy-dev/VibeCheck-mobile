import { useState } from 'react';
import { UseProfileSetupReturn } from '../../domain/types/profile-setup.types';
import { ProfileService } from '../../infrastructure/services/ProfileService';

/**
 * Custom hook managing the state of the ProfileSetup Screen workflows.
 * @param onComplete - callback executed upon successful form submission.
 */
export const useProfileSetup = (onComplete?: () => void): UseProfileSetupReturn => {
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);

  const handlePickAvatar = () => {
    setAvatarUri(ProfileService.getMockAvatar());
  };


  const handleSubmit = async () => {
    if (nickname.trim() && birthYear.length === 4) {
      await ProfileService.createProfile({ nickname, birthYear, avatarUri });
      if (onComplete) {
        onComplete();
      }
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
  };
};
