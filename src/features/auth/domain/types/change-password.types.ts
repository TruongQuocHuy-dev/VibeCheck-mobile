export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}
