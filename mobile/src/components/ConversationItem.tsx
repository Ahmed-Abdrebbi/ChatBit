import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Conversation } from '../api/conversations';
import { colors, spacing, typography, borderRadius } from '../theme';

interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
  showAgent?: boolean;
  showClient?: boolean;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'en_attente':
      return 'En attente';
    case 'en_cours':
      return 'En cours';
    case 'fermee':
      return 'Fermé';
    default:
      return status;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'en_attente':
      return colors.primary;
    case 'en_cours':
      return colors.success;
    case 'fermee':
      return colors.muted;
    default:
      return colors.muted;
  }
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
  showAgent = false,
  showClient = false,
}) => {
  const statusLabel = getStatusLabel(conversation.status);
  const statusColor = getStatusColor(conversation.status);
  const createdDate = new Date(conversation.createdat);
  const timeStr = createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.subject} numberOfLines={1}>
          {conversation.subject}
        </Text>
        <Text style={styles.time}>{timeStr}</Text>
      </View>

      {showAgent && conversation.agent_fullname && (
        <View style={styles.participantRow}>
          <MaterialIcons name="support-agent" size={14} color={colors.primaryHover} />
          <Text style={styles.participantText}>{conversation.agent_fullname}</Text>
        </View>
      )}

      {showClient && conversation.client_fullname && (
        <View style={styles.participantRow}>
          <MaterialIcons name="person" size={14} color={colors.primaryHover} />
          <Text style={styles.participantText}>{conversation.client_fullname}</Text>
        </View>
      )}

      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  subject: {
    ...typography.headerSm,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  time: {
    ...typography.timestamp,
    color: colors.muted,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: 4,
  },
  participantText: {
    ...typography.bodySm,
    color: colors.primaryHover,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...typography.statusLabel,
  },
});
