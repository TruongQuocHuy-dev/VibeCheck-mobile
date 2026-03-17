import { ASSETS } from '../../../../assets/assets';

/**
 * ProfileService handling simulated profile creation operations.
 */
export const ProfileService = {
  /**
   * Submit new profile payload setup.
   */
  createProfile: async (payload: { nickname: string; birthYear: string; avatarUri?: string }): Promise<void> => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
    console.log('[ProfileService] Profile created successfully', payload);
  },

  /**
   * Handle static avatar picking trigger for standard preview mock up.
   */
  getMockAvatar: (): string => {
    return ASSETS.URLS.AVATAR_PLACEHOLDER;
  },
};
