import { useState } from 'react';
import { UseProfileSetupReturn } from '../../types/presentation/auth/profile-setup.types';
import { ASSETS } from '../../assets/assets';

/**
 * Custom hook managing the state of the ProfileSetup Screen workflows.
 * @param onComplete - callback executed upon successful form submission.
 */
export const useProfileSetup = (onComplete?: () => void): UseProfileSetupReturn => {
  const [nickname, setNickname] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);

  const handlePickAvatar = () => {
    // Simulate image picker setup.
    // Setting a static URI to trigger standard UI blurred layout previews safely on render.
    setAvatarUri(ASSETS.URLS.AVATAR_PLACEHOLDER);
  };


  const handleSubmit = () => {
    if (nickname.trim() && birthYear.length === 4) {
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
