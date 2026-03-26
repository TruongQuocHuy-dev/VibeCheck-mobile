import { io, Socket } from 'socket.io-client';
import { APP_CONFIG } from '../../core/config/app.config';
import { getAccessToken } from '../storage/AsyncStorage';

let socket: Socket | null = null;

/**
 * Connect to the Socket.io server with the authenticated userId.
 * Call this after a successful login.
 */
export const connectSocket = async (userId: string): Promise<void> => {
  if (socket?.connected) return;

  const token = await getAccessToken();

  socket = io(APP_CONFIG.apiBaseUrl.replace('/api', ''), {
    query: { userId },
    extraHeaders: {
      Authorization: `Bearer ${token ?? ''}`,
    },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
};

/**
 * Disconnect socket. Call on logout.
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Join a conversation room to receive real-time messages.
 */
export const joinConversation = (conversationId: string): void => {
  socket?.emit('join_conversation', conversationId);
};

/**
 * Leave a conversation room.
 */
export const leaveConversation = (conversationId: string): void => {
  socket?.emit('leave_conversation', conversationId);
};

/**
 * Listen for a specific socket event.
 */
export const onSocketEvent = <T>(event: string, callback: (data: T) => void): void => {
  socket?.on(event, callback);
};

/**
 * Remove a specific socket event listener.
 */
export const offSocketEvent = <T>(event: string, callback?: (data: T) => void): void => {
  if (callback) {
    socket?.off(event, callback as (...args: any[]) => void);
    return;
  }

  socket?.off(event);
};

/**
 * Get the raw socket instance (use sparingly).
 */
export const getSocket = (): Socket | null => socket;
