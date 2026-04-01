import { Message } from '../domain/types/chat.types';
import { 
  onSocketEvent, 
  offSocketEvent, 
  emitSocketEvent,
  joinConversation,
  leaveConversation
} from '../../../infrastructure/services/socket.service';

export type MessageCallback = (payload: { conversationId: string; message: Message }) => void;
export type ReactionCallback = (payload: { messageId: string; reactions: any[] }) => void;
export type StatusCallback = (payload: { userId: string; isOnline: boolean; lastActive: string }) => void;
export type RecallCallback = (payload: { messageId: string; conversationId: string }) => void;

class ChatSocketService {
  onNewMessage(callback: MessageCallback) {
    onSocketEvent('new_message', callback);
  }

  offNewMessage(callback: MessageCallback) {
    offSocketEvent('new_message', callback);
  }

  onReactionUpdate(callback: ReactionCallback) {
    onSocketEvent('reaction_update', callback);
  }

  offReactionUpdate(callback: ReactionCallback) {
    offSocketEvent('reaction_update', callback);
  }

  onMessageRecalled(callback: RecallCallback) {
    onSocketEvent('message_recalled', callback);
  }

  offMessageRecalled(callback: RecallCallback) {
    offSocketEvent('message_recalled', callback);
  }

  onUserStatusUpdate(callback: StatusCallback) {
    onSocketEvent('status_update', callback);
  }

  offUserStatusUpdate(callback: StatusCallback) {
    offSocketEvent('status_update', callback);
  }

  joinRoom(conversationId: string) {
    joinConversation(conversationId);
  }

  leaveRoom(conversationId: string) {
    leaveConversation(conversationId);
  }

  onTyping(callback: (payload: { conversationId: string; userId: string }) => void) {
    onSocketEvent('user_typing', callback);
  }

  offTyping() {
    offSocketEvent('user_typing');
  }

  onStopTyping(callback: (payload: { conversationId: string; userId: string }) => void) {
    onSocketEvent('user_stop_typing', callback);
  }

  offStopTyping() {
    offSocketEvent('user_stop_typing');
  }

  emitTyping(conversationId: string) {
    emitSocketEvent('typing', conversationId);
  }

  emitStopTyping(conversationId: string) {
    emitSocketEvent('stop_typing', conversationId);
  }

  onUserBlocked(callback: (payload: { targetUserId: string; isBlocked: boolean; blockedByMe: boolean }) => void) {
    onSocketEvent('user_blocked', callback);
  }

  offUserBlocked(callback: (payload: { targetUserId: string; isBlocked: boolean; blockedByMe: boolean }) => void) {
    offSocketEvent('user_blocked', callback);
  }
}

export const chatSocketService = new ChatSocketService();
