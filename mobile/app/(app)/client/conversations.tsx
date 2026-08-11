import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui/Header';
import { colors, spacing, typography, borderRadius } from '../../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';

const mockConversations = [
  { id: '1', subject: 'Problème de connexion', agent: 'Agent Alice', status: 'Active', lastMessage: 'Pouvez-vous m\'envoyer une capture d\'écran ?', time: '10:30' },
  { id: '2', subject: 'Facturation double', agent: 'Agent Bob', status: 'Closed', lastMessage: 'Le remboursement a été effectué.', time: 'Hier' },
];

export default function ClientConversationsScreen() {
  const router = useRouter();
  // Set to empty array to test empty state
  const [conversations, setConversations] = useState(mockConversations);

  const handleNewConversation = () => {
    router.push('/(modals)/new-conversation');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="chat-bubble-outline" size={64} color={colors.surface} />
      <Text style={styles.emptyTitle}>Aucune conversation</Text>
      <Text style={styles.emptySubtitle}>Vous n'avez pas de conversation en cours.</Text>
      <TouchableOpacity style={styles.newChatButton} onPress={handleNewConversation}>
        <Text style={styles.newChatText}>Nouvelle conversation</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: typeof mockConversations[0] }) => (
    <TouchableOpacity 
      style={styles.conversationCard}
      onPress={() => router.push(`/(app)/client/chat/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.agentInfo}>Avec: {item.agent}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      <View style={[styles.statusBadge, item.status === 'Closed' && styles.statusBadgeClosed]}>
        <Text style={[styles.statusText, item.status === 'Closed' && styles.statusTextClosed]}>
          {item.status === 'Closed' ? 'Fermé' : 'Actif'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Mes Conversations" 
        rightElement={
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <MaterialIcons name="logout" size={24} color={colors.text} />
          </TouchableOpacity>
        }
      />
      
      {conversations.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <FlatList
            data={conversations}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity style={styles.fab} onPress={handleNewConversation}>
            <MaterialIcons name="add" size={24} color={colors.onPrimary} />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.displayTitle,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.bodyMd,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  newChatButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  newChatText: {
    ...typography.uiAction,
    color: colors.onPrimary,
  },
  conversationCard: {
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
  },
  time: {
    ...typography.timestamp,
    color: colors.muted,
  },
  agentInfo: {
    ...typography.bodySm,
    color: colors.primaryHover,
    marginBottom: spacing.xs,
  },
  lastMessage: {
    ...typography.bodyMd,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(232, 163, 61, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusBadgeClosed: {
    backgroundColor: colors.inputBg,
  },
  statusText: {
    ...typography.statusLabel,
    color: colors.primary,
  },
  statusTextClosed: {
    color: colors.muted,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
