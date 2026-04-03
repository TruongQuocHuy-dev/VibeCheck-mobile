import { io, Socket } from 'socket.io-client';
import { APP_CONFIG } from '../../core/config/app.config';
import { getAccessToken } from '../storage/AsyncStorage';

let socket: Socket | null = null;

interface SocketListener {
  event: string;
  callback: (data: any) => void;
}

// Registry to keep track of listeners to re-attach upon reconnection or late connection
const listenerRegistry: SocketListener[] = [];

/**
 * Connect to the Socket.io server with the authenticated userId.
 * Call this after a successful login.
 */
export const connectSocket = async (userId: string): Promise<void> => {
  if (socket?.connected) return;

  const token = await getAccessToken();
  const socketUrl = APP_CONFIG.apiBaseUrl.replace('/api', '');

  console.log(`🔌 [SocketService] Connecting to ${socketUrl} for user ${userId}...`);

  socket = io(socketUrl, {
    query: { userId },
    extraHeaders: {
      Authorization: `Bearer ${token ?? ''}`,
    },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('✅ [SocketService] Connected successfully. ID:', socket?.id);
    
    // Attach all registered listeners
    listenerRegistry.forEach(({ event, callback }) => {
      socket?.on(event, callback);
    });

    const { DeviceEventEmitter } = require('react-native');
    DeviceEventEmitter.emit('socket_connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('🛑 [SocketService] Disconnected. Reason:', reason);
    if (reason === 'io server disconnect') {
      socket?.connect();
    }
  });

  socket.on('connect_error', (err) => {
    console.error('❌ [SocketService] Connection error:', err.message);
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
 * If the socket is not yet connected, the listener will be attached upon connection.
 */
export const onSocketEvent = <T>(event: string, callback: (data: T) => void): void => {
  // Add to registry (for reconnection or late connection)
  const castCallback = callback as (data: any) => void;
  
  // Clean up existing identical listener to avoid duplicates
  const existingIdx = listenerRegistry.findIndex(l => l.event === event && l.callback === castCallback);
  if (existingIdx === -1) {
    listenerRegistry.push({ event, callback: castCallback });
  }

  // Attach immediately if socket exists
  socket?.on(event, castCallback);
};

/**
 * Remove a specific socket event listener.
 */
export const offSocketEvent = <T>(event: string, callback?: (data: T) => void): void => {
  const castCallback = callback as (data: any) => void;

  // Remove from registry
  if (callback) {
    const idx = listenerRegistry.findIndex(l => l.event === event && l.callback === castCallback);
    if (idx > -1) {
      listenerRegistry.splice(idx, 1);
    }
    socket?.off(event, castCallback);
  } else {
    // Remove all for this event
    for (let i = listenerRegistry.length - 1; i >= 0; i--) {
      if (listenerRegistry[i].event === event) {
        listenerRegistry.splice(i, 1);
      }
    }
    socket?.off(event);
  }
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
