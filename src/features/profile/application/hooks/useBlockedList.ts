import { useState, useCallback, useEffect } from 'react';
import apiClient from '../../../../infrastructure/api/axios';
import { ENDPOINTS } from '../../../../infrastructure/api/endpoints';
import { useToast } from '../../../../shared/hooks/useToast';
import { useLoading } from '../../../../shared/hooks/useLoading';

export type BlockedUser = {
  _id: string;
  fullName: string;
  displayName: string;
  avatar: string;
  bio: string;
};

export const useBlockedList = () => {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const fetchBlockedList = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const response: any = await apiClient.get(ENDPOINTS.USER.GET_BLOCKED_LIST);
      // Matches the backend response: { success: true, data: { blockedUsers: [...] } }
      const users = response?.blockedUsers || response?.data?.blockedUsers || [];
      setBlockedUsers(users);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải danh sách chặn.';
      showToast(msg, 'error');
    } finally {
      setIsLoadingList(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBlockedList();
  }, [fetchBlockedList]);

  const handleUnblock = useCallback(async (targetUserId: string) => {
    showLoading('Đang bỏ chặn...');
    try {
      await apiClient.post(ENDPOINTS.USER.UNBLOCK, { targetUserId });
      
      // Update local state by removing the unblocked user
      setBlockedUsers(prev => prev.filter(u => u._id !== targetUserId));
      showToast('Đã bỏ chặn người dùng.', 'success');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể bỏ chặn người dùng.';
      showToast(msg, 'error');
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  return {
    blockedUsers,
    isLoadingList,
    handleUnblock,
    refreshList: fetchBlockedList,
  };
};
