import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface ChatBubbleProps {
  message: string;
  time: string;
  isUser: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, time, isUser }) => {
  return (
    <View style={[styles.container, isUser ? styles.containerUser : styles.containerOther]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleOther]}>
        <Text style={[styles.message, isUser ? styles.messageUser : styles.messageOther]}>
          {message}
        </Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: '80%',
  },
  containerUser: {
    alignSelf: 'flex-end',
  },
  containerOther: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  message: {
    ...typography.bodyMd,
  },
  messageUser: {
    color: colors.onPrimary,
  },
  messageOther: {
    color: colors.text,
  },
  time: {
    ...typography.timestamp,
    color: colors.muted,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
});
