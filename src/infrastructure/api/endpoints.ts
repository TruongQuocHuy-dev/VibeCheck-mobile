/**
 * Central API endpoint definitions.
 * Import from here — never write URL strings directly in service files.
 */
export const ENDPOINTS = {
  AUTH: {
    CHECK_PHONE: '/auth/check-phone',
    REGISTER: '/auth/register',
    SET_PASSWORD: '/auth/set-password',
    LOGIN: '/auth/login',
    GOOGLE_LOGIN: '/auth/google-login',
  },
  USER: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPDATE_AVATAR: '/users/avatar',
    UPDATE_VIBES: '/users/vibes',
    UPDATE_BIO: '/users/bio',
    ADD_PHOTO: '/users/photos',
    DELETE_PHOTO: '/users/photos',
    PUBLIC_PROFILE: (id: string) => `/users/${id}/profile`,
  },
  VIBES: {
    GET_ALL: '/vibes',
  },
  SWIPES: {
    CANDIDATES: '/swipes/candidates',      // GET: users not yet swiped
    MATCHES: '/swipes/matches',            // GET: matched users
    CREATE: '/swipes',                     // POST: swipe action
  },
  CONVERSATIONS: {
    LIST: '/conversations',                // GET: chat list
    MESSAGES: (id: string) => `/conversations/${id}/messages`, // GET/POST
  },
  POSTS: {
    FEED: '/posts',                        // GET: paginated feed
    CREATE: '/posts',                      // POST: create post
    LIKE: (id: string) => `/posts/${id}/like`,       // POST: toggle like
    COMMENT: (id: string) => `/posts/${id}/comments`, // POST: add comment
    DELETE: (id: string) => `/posts/${id}`,           // DELETE
  },
} as const;

