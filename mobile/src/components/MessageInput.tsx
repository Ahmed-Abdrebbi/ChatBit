import React, { useState, useRef, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

interface MessageInputProps {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const TYPING_DEBOUNCE_MS = 1500;

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = 'Écrivez un message...',
}) => {
  const [text, setText] = useState('');
  const typingRef = useRef(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = useCallback(
    (value: string) => {
      setText(value);

      if (disabled) return;

      // Start typing
      if (value.length > 0 && !typingRef.current) {
        typingRef.current = true;
        onTypingStart();
      }

      // Reset debounce timer
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      if (value.length > 0) {
        typingTimerRef.current = setTimeout(() => {
          typingRef.current = false;
          onTypingStop();
        }, TYPING_DEBOUNCE_MS);
      } else {
        // Cleared input — stop typing immediately
        typingRef.current = false;
        onTypingStop();
      }
    },
    [onTypingStart, onTypingStop, disabled]
  );

  const handleSend = useCallback(() => {
    if (!text.trim() || disabled) return;

    onSend(text.trim());
    setText('');

    // Stop typing indicator
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (typingRef.current) {
      typingRef.current = false;
      onTypingStop();
    }
  }, [text, disabled, onSend, onTypingStop]);

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <TextInput
        style={styles.input}
        placeholder={disabled ? 'Conversation fermée' : placeholder}
        placeholderTextColor={colors.muted}
        value={text}
        onChangeText={handleChangeText}
        multiline
        editable={!disabled}
        maxLength={2000}
      />
      <TouchableOpacity
        style={[styles.sendButton, (!text.trim() || disabled) && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
      >
        <MaterialIcons name="send" size={20} color={colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
    alignItems: 'flex-end',
  },
  containerDisabled: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    color: colors.text,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 48,
    maxHeight: 120,
    ...typography.bodyMd,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
