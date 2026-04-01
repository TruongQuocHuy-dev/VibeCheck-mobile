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
  const socketUrl = APP_CONFIG.apiBaseUrl.replace('/api', '');

  socket = io(socketUrl, {
    query: { userId },
    extraHeaders: {
      Authorization: `Bearer ${token ?? ''}`,
    },
    // Removing explicit websocket transport to allow fallback to polling (more stable for emulators)
    // transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected successfully. ID:', socket?.id);
    const { DeviceEventEmitter } = require('react-native');
    DeviceEventEmitter.emit('socket_connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('🛑 Socket disconnected. Reason:', reason);
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket?.connect();
    }
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
    console.log('💡 TIP: If on a real device, ensure API_BASE_URL is your computer\'s LAN IP.');
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
 * Emit a specific socket event.
 */
export const emitSocketEvent = <T>(event: string, data: T): void => {
  socket?.emit(event, data);
};

/**
 * Get the raw socket instance (use sparingly).
 */
export const getSocket = (): Socket | null => socket;
