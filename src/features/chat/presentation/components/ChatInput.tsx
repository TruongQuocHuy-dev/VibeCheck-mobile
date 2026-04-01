import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Message } from '../../domain/types/chat.types';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius as br } from '../../../../core/theme/spacing';

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping: (isTyping: boolean) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  bottomInset?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  onTyping,
  replyingTo, 
  onCancelReply,
  bottomInset = 0 
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<any>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
      isTypingRef.current = false;
      onTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleChangeText = (val: string) => {
    setText(val);
    
    if (!isTypingRef.current && val.length > 0) {
      isTypingRef.current = true;
      onTyping(true);
    } else if (isTypingRef.current && val.length === 0) {
      isTypingRef.current = false;
      onTyping(false);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTyping(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: Math.max(bottomInset, spacing.sm) }]}>
      {replyingTo && (
        <View style={styles.replyPreview}>
          <View style={styles.replyContent}>
            <Text style={styles.replySender} numberOfLines={1}>
              Đang trả lời {(replyingTo.sender as any)?.fullName || 'Người dùng'}
            </Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyingTo.content}
            </Text>
          </View>
          <TouchableOpacity onPress={onCancelReply}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="images-outline" size={24} color={colors.white} />
        </TouchableOpacity>
        
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Nhắn tin..."
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={handleChangeText}
            multiline
          />
          <TouchableOpacity style={styles.innerIconButton}>
             <Icon name="happy-outline" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.rightActions}>
          {!text ? (
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="mic" size={26} color={colors.messengerBlue} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
              <Icon name="send" size={24} color={colors.messengerBlue} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md_sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgDark,
    borderTopWidth: 0.5,
    borderTopColor: colors.surfaceHigh,
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md_sm,
    backgroundColor: colors.overlayLight,
    borderRadius: br.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.messengerBlue,
  },
  replyContent: {
    flex: 1,
  },
  replySender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.messengerBlue,
  },
  replyText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.messengerBlue,
    marginBottom: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surfaceMedium,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    minHeight: 44,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    maxHeight: 120,
  },
  innerIconButton: {
    paddingBottom: 8,
    marginLeft: spacing.xs,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  actionButton: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
