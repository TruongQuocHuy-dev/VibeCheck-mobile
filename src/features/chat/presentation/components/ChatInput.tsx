import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  Platform,
  ScrollView,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Message } from '../../domain/types/chat.types';
import { colors } from '../../../../core/theme/colors';
import { spacing, borderRadius as br } from '../../../../core/theme/spacing';
import { CHAT_STRINGS } from '../../domain/constants/chat.constants';

interface ChatInputProps {
  onSend: (
    text: string, 
    type?: Message['type'], 
    media?: { uri: string; type: string; name: string } | Array<{ uri: string; type: string; name: string }>
  ) => void;
  onTyping: (isTyping: boolean) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  bottomInset?: number;
}

const audioRecorderPlayer = new AudioRecorderPlayer();
const QUICK_EMOJIS = ['❤️', '😂', '😮', '😢', '😡', '👍', '🔥', '🙌', '✨', '👌'];

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  onTyping,
  replyingTo, 
  onCancelReply,
  bottomInset = 0 
}) => {
  const [text, setText] = useState('');
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  
  const inputRef = useRef<TextInput>(null);
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<any>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim(), 'text');
      setText('');
      isTypingRef.current = false;
      onTyping(false);
      setIsEmojiOpen(false);
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
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTyping(false);
      }
    }, 3000);
  };

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
      includeBase64: false,
      selectionLimit: 10,
    });

    if (result.assets && result.assets.length > 0) {
      if (result.assets.length === 1) {
        const asset = result.assets[0];
        onSend(
          '', 
          'image', 
          { 
            uri: asset.uri!, 
            type: asset.type || 'image/jpeg', 
            name: asset.fileName || `img_${Date.now()}.jpg` 
          }
        );
      } else {
        const mediaList = result.assets.map(asset => ({
          uri: asset.uri!,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.jpg`
        }));
        onSend('', 'image', mediaList);
      }
    }
  };

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple(
          Number(Platform.Version) >= 33
            ? [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]
            : [
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              ]
        );

        if (grants['android.permission.RECORD_AUDIO'] !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    setIsRecording(true);
    await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      return;
    });
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    setRecordTime('00:00');
    
    if (result) {
      onSend(
        '', 
        'audio', 
        { 
          uri: result, 
          type: 'audio/mp4', 
          name: `voice_${Date.now()}.mp4` 
        }
      );
    }
  };

  const addEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
    };
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: Math.max(bottomInset, spacing.sm) }]}>
      {replyingTo && (
        <View style={styles.replyPreview}>
          <View style={styles.replyContent}>
            <Text style={styles.replySender} numberOfLines={1}>
              {CHAT_STRINGS.replying_to} {(replyingTo.sender as any)?.fullName || CHAT_STRINGS.unnamed_user}
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

      {isEmojiOpen && (
        <View style={styles.emojiBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiList}>
            {QUICK_EMOJIS.map(emoji => (
              <TouchableOpacity key={emoji} onPress={() => addEmoji(emoji)} style={styles.emojiItem}>
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.inputRow}>
        {!isRecording ? (
          <>
            <TouchableOpacity style={styles.iconButton} onPress={handlePickImage}>
              <Icon name="images-outline" size={22} color={colors.white} />
            </TouchableOpacity>
            
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={CHAT_STRINGS.type_message}
                placeholderTextColor={colors.textMuted}
                value={text}
                onChangeText={handleChangeText}
                multiline
              />
              <TouchableOpacity 
                style={styles.innerIconButton} 
                onPress={() => setIsEmojiOpen(!isEmojiOpen)}
              >
                 <Icon 
                   name={isEmojiOpen ? "happy" : "happy-outline"} 
                   size={24} 
                   color={isEmojiOpen ? colors.messengerBlue : colors.textMuted} 
                 />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.recordingWrapper}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>{CHAT_STRINGS.recording} {recordTime}</Text>
            <TouchableOpacity style={styles.cancelRecord} onPress={() => {
              audioRecorderPlayer.stopRecorder();
              setIsRecording(false);
            }}>
              <Text style={styles.cancelText}>{CHAT_STRINGS.cancel}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.rightActions}>
          {!text && !isRecording ? (
            <TouchableOpacity style={styles.actionButton} onPress={onStartRecord}>
              <Icon name="mic" size={26} color={colors.messengerBlue} />
            </TouchableOpacity>
          ) : isRecording ? (
            <TouchableOpacity style={[styles.actionButton, styles.sendVoiceBtn]} onPress={onStopRecord}>
              <Icon name="send" size={20} color={colors.white} />
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
  replyContent: { flex: 1 },
  replySender: { fontSize: 12, fontWeight: 'bold', color: colors.messengerBlue },
  replyText: { fontSize: 12, color: colors.textSecondary },
  emojiBar: {
    paddingVertical: spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.surfaceHigh,
    marginBottom: spacing.xs,
  },
  emojiList: { paddingHorizontal: spacing.xs },
  emojiItem: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  emojiText: { fontSize: 24 },
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
  innerIconButton: { paddingBottom: 8, marginLeft: spacing.xs },
  recordingWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cyanBg,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginRight: spacing.sm,
  },
  recordingText: { color: colors.white, flex: 1, fontSize: 14 },
  cancelRecord: { paddingHorizontal: spacing.sm },
  cancelText: { color: colors.error, fontWeight: 'bold' },
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
  sendVoiceBtn: {
    backgroundColor: colors.messengerBlue,
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 4,
  }
});
