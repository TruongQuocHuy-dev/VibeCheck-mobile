import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

/**
 * Profile service — global infrastructure layer.
 */
export const ProfileService = {
  /**
   * Submit profile payload and optional avatar upload.
   */
  createProfile: async (payload: {
    fullName: string;
    nickname: string;
    gender: 'male' | 'female';
    birthYear: string;
    avatarUri?: string;
  }): Promise<void> => {
    await apiClient.patch(ENDPOINTS.USER.UPDATE_PROFILE, {
      fullName: payload.fullName,
      displayName: payload.nickname,
      gender: payload.gender,
      birthYear: Number(payload.birthYear),
    });

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

  getMockAvatar: (): string => {
    return 'https://avatar.iran.liara.run/public/boy';
  },

  /**
   * Get another user's public profile.
   */
  getPublicProfile: async (id: string): Promise<any> => {
    const url = ENDPOINTS.USER.PUBLIC_PROFILE(id);
    const data = await apiClient.get<any, any>(url);
    return data?.user || data;
  },
};
