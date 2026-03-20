/**
 * Central API endpoint definitions.
 * Import from here — never write URL strings directly in service files.
 */
export const ENDPOINTS = {
  AUTH: {
    CHECK_PHONE: '/auth/check-phone',
    REGISTER: '/auth/register',       // POST: Firebase idToken → app JWT
    SET_PASSWORD: '/auth/set-password', // POST: set password after OTP (auth required)
    LOGIN: '/auth/login',             // POST: phone + password login
    GOOGLE_LOGIN: '/auth/google-login', // POST: google idToken verification
  },
  USER: {
    GET_PROFILE: '/users/profile',    // GET: fetch current profile
    UPDATE_PROFILE: '/users/profile', // PATCH: update displayName, birthYear
    UPDATE_AVATAR: '/users/avatar',   // POST: upload file multipart
    UPDATE_VIBES: '/users/vibes',     // POST: update vibes array
  },
  VIBES: {
    GET_ALL: '/vibes',
  },
} as const;
