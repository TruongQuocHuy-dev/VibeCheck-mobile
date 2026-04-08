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
    CHANGE_PASSWORD: '/auth/change-password',
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
    BLOCK: '/users/block',
    UNBLOCK: '/users/unblock',
    GET_BLOCKED_LIST: '/users/blocked-list',
    UPDATE_PRIVACY: '/users/privacy',
  },
  VIBES: {
    GET_ALL: '/vibes',
  },
  SWIPES: {
    CANDIDATES: '/swipes/candidates',      // GET: users not yet swiped
    CANDIDATES_ESTIMATE: '/swipes/candidates/estimate',
    MATCHES: '/swipes/matches',            // GET: matched users
    CREATE: '/swipes',                     // POST: swipe action
    UNDO_DISLIKE: (swipedId: string) => `/swipes/dislike/${swipedId}`,
    BLOCK: '/swipes/block',
    REPORT: '/swipes/report',
  },
  CONVERSATIONS: {
    LIST: '/conversations',                // GET: chat list
    MESSAGES: (id: string) => `/conversations/${id}/messages`, // GET/POST
    MEDIA: (id: string) => `/conversations/${id}/media`,
    CLEAR_HISTORY: (id: string) => `/conversations/${id}/messages`,
    READ: (id: string) => `/conversations/${id}/read`,
    PIN: (id: string) => `/conversations/${id}/pin`,
    UNREAD: (id: string) => `/conversations/${id}/unread`,
  },
  MESSAGES: {
    ACTION: (id: string) => `/messages/${id}`,
    REACTION: (id: string) => `/conversations/messages/${id}/reaction`,
    DELIVERED: (id: string) => `/conversations/messages/${id}/delivered`,
    UPLOAD: '/media/upload',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ_ALL: '/notifications/read-all',
    READ_ONE: (id: string) => `/notifications/${id}/read`,
    DELETE_ONE: (id: string) => `/notifications/${id}`,
    DELETE_ALL: '/notifications',
  },
  VIBE_STORIES: {
    FEED: '/vibe-stories/feed',              // GET: feed of matches' stories
    CREATE: '/vibe-stories',                 // POST: upload photo + music info
    DELETE: (id: string) => `/vibe-stories/${id}`,
    REPLY: (id: string) => `/vibe-stories/${id}/reply`,
    REACT: (id: string) => `/vibe-stories/${id}/react`,
    VIEW: (id: string) => `/vibe-stories/${id}/view`,
    INTERACTIONS: (id: string) => `/vibe-stories/${id}/interactions`,
    USER_HISTORY: (userId: string) => `/vibe-stories/user/${userId}`,
  },
} as const;
