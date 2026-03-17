const BASE_URL = 'http://10.0.2.2:3000/api'; // Fallback Android Endpoint

/**
 * Infrastructure Service handling direct network API calls.
 */
export const AuthService = {
  checkUser: async (phone: string): Promise<{ exists: boolean }> => {
    const response = await fetch(`${BASE_URL}/auth/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (!response.ok) throw new Error('Lỗi mạng hoặc không tìm thấy người dùng');
    return response.json();
  },

  sendOtp: async (phone: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (!response.ok) throw new Error('Không thể gửi mã OTP');
  },

  verifyOtp: async (phone: string, otp: string): Promise<{ token: string }> => {
    const response = await fetch(`${BASE_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    if (!response.ok) throw new Error('Mã OTP không hợp lệ');
    return response.json();
  },

  login: async (phone: string, password: string): Promise<{ token: string }> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    if (!response.ok) throw new Error('Thông tin đăng nhập sai');
    return response.json();
  },
};
