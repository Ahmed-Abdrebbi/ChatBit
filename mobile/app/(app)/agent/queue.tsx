import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui/Header';
import { colors, spacing, typography, borderRadius } from '../../../src/theme';
import { Button } from '../../../src/components/ui/Button';
import { useConversations } from '../../../src/hooks/useConversations';
import { Conversation } from '../../../src/api/conversations';

export default function AgentQueueScreen() {
  const router = useRouter();
  const { conversations, isLoading, assignConversation, refetch } = useConversations();
  const [takingId, setTakingId] = useState<number | null>(null);

  // Filter for waiting/unassigned conversations
  const pendingConversations = conversations.filter(c => c.status === 'en_attente');

  const handleTakeTicket = async (conversationId: number) => {
    setTakingId(conversationId);
    try {
      await assignConversation.mutateAsync(conversationId);
      router.push(`/(app)/agent/chat/${conversationId}`);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Impossible de prendre ce ticket';
      Alert.alert('Erreur', message);
    } finally {
      setTakingId(null);
    }
  };

  const formatWaitTime = (createdAt: string) => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const diffMinutes = Math.max(0, Math.floor((now - created) / 60000));
    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}h ${diffMinutes % 60}m`;
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <View style={styles.queueCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.clientName}>{item.client_fullname || `Client #${item.clientid}`}</Text>
        <Text style={styles.waitTime}>Attente : {formatWaitTime(item.createdat)}</Text>
      </View>
      <Text style={styles.subject} numberOfLines={2}>{item.subject}</Text>
      
      <View style={styles.actionContainer}>
        <Button 
          title={takingId === item.id ? "Assignation..." : "Prendre en charge"} 
          onPress={() => handleTakeTicket(item.id)} 
          loading={takingId === item.id}
          disabled={takingId !== null}
          style={styles.takeButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="File d'attente" showBack />
      
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={pendingConversations}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucune demande en attente.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.md,
  },
  queueCard: {
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
  clientName: {
    ...typography.headerSm,
    color: colors.text,
    flex: 1,
  },
  waitTime: {
    ...typography.timestamp,
    color: colors.primary,
    fontWeight: '500',
  },
  subject: {
    ...typography.bodyMd,
    color: colors.muted,
    marginBottom: spacing.md,
  },
  actionContainer: {
    marginTop: spacing.xs,
  },
  takeButton: {
    minHeight: 40,
    paddingVertical: 10,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.muted,
  },
});
