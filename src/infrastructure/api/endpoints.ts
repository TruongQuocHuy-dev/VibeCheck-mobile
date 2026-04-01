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
    BLOCK: '/users/block',
    UNBLOCK: '/users/unblock',
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
  },
  POSTS: {
    FEED: '/posts',                        // GET: paginated feed
    CREATE: '/posts',                      // POST: create post
    LIKE: (id: string) => `/posts/${id}/like`,       // POST: toggle like
    COMMENT: (id: string) => `/posts/${id}/comments`, // POST: add comment
    DELETE: (id: string) => `/posts/${id}`,           // DELETE
  },
  VIBE_STORIES: {
    FEED: '/vibe-stories/feed',              // GET: feed of matches' stories
    CREATE: '/vibe-stories',                 // POST: upload photo + music info
    DELETE: (id: string) => `/vibe-stories/${id}`,
    REPLY: (id: string) => `/vibe-stories/${id}/reply`,
    REACT: (id: string) => `/vibe-stories/${id}/react`,
    VIEW: (id: string) => `/vibe-stories/${id}/view`,
    INTERACTIONS: (id: string) => `/vibe-stories/${id}/interactions`,
  },
} as const;
