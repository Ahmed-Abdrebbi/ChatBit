import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface MessageBubbleProps {
  content: string;
  time: string;
  isOwn: boolean;
  senderName?: string;
  isRead?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  time,
  isOwn,
  senderName,
  isRead,
}) => {
  return (
    <View style={[styles.container, isOwn ? styles.containerOwn : styles.containerOther]}>
      {!isOwn && senderName && (
        <Text style={styles.senderName}>{senderName}</Text>
      )}
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.message, isOwn ? styles.messageOwn : styles.messageOther]}>
          {content}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>{time}</Text>
        {isOwn && isRead !== undefined && (
          <Text style={[styles.readStatus, isRead && styles.readStatusRead]}>
            {isRead ? '✓✓' : '✓'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: '80%',
  },
  containerOwn: {
    alignSelf: 'flex-end',
  },
  containerOther: {
    alignSelf: 'flex-start',
  },
  senderName: {
    ...typography.bodySm,
    color: colors.primaryHover,
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  bubbleOwn: {
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
  messageOwn: {
    color: colors.onPrimary,
  },
  messageOther: {
    color: colors.text,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    alignSelf: 'flex-end',
    gap: 4,
  },
  time: {
    ...typography.timestamp,
    color: colors.muted,
  },
  readStatus: {
    fontSize: 10,
    color: colors.muted,
  },
  readStatusRead: {
    color: colors.primary,
  },
});
