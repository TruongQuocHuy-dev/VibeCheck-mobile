import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';

/**
 * ProfileService handling profile creation and image upload operations.
 */
export const ProfileService = {
  /**
   * Submit new profile payload setup with avatar upload support.
   */
  createProfile: async (payload: { nickname: string; birthYear: string; avatarUri?: string }): Promise<void> => {
    // 1. Update text profile fields
    await apiClient.patch(ENDPOINTS.USER.UPDATE_PROFILE, {
      displayName: payload.nickname,
      birthYear: Number(payload.birthYear),
    });

    // 2. Upload Avatar if local file URI exists
    if (payload.avatarUri && payload.avatarUri.startsWith('file://')) {
      const formData = new FormData();
      formData.append('avatar', {
        uri: payload.avatarUri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      } as any);

      await apiClient.post(ENDPOINTS.USER.UPDATE_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  },

  /**
   * Mock preview accessor placeholder fallback.
   */
  getMockAvatar: (): string => {
    return 'https://avatar.iran.liara.run/public/boy';
  },
};
