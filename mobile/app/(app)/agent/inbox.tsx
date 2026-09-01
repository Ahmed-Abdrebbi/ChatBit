import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui/Header';
import { ConversationItem } from '../../../src/components/ConversationItem';
import { colors, spacing, typography } from '../../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useConversations } from '../../../src/hooks/useConversations';
import { useSocket } from '../../../src/hooks/useSocket';
import { Conversation } from '../../../src/api/conversations';

export default function AgentInboxScreen() {
  const router = useRouter();
  const { conversations, isLoading, refetch } = useConversations();
  const { isConnected } = useSocket();

  // Filter for conversations assigned to this agent (en_cours)
  const activeConversations = conversations.filter((c: Conversation) => c.status === 'en_cours');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Boîte de réception" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Boîte de réception" 
        rightElement={
          <View style={styles.headerActions}>
            <View style={[styles.connectionDot, isConnected ? styles.dotOnline : styles.dotOffline]} />
            <TouchableOpacity onPress={() => router.push('/(app)/agent/queue')} style={styles.actionIcon}>
              <MaterialIcons name="people-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(app)/agent/profile')} style={styles.actionIcon}>
              <MaterialIcons name="person-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        }
      />
      
      <FlatList
        data={activeConversations}
        keyExtractor={(item: Conversation) => item.id.toString()}
        renderItem={({ item }: { item: Conversation }) => (
          <ConversationItem
            conversation={item}
            onPress={() => router.push(`/(app)/agent/chat/${item.id}`)}
            showClient
          />
        )}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={48} color={colors.muted} />
            <Text style={styles.emptyText}>Aucune conversation active.</Text>
            <TouchableOpacity onPress={() => router.push('/(app)/agent/queue')}>
              <Text style={styles.queueLink}>Voir la file d'attente</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  dotOnline: {
    backgroundColor: colors.success,
  },
  dotOffline: {
    backgroundColor: colors.errorText,
  },
  actionIcon: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.muted,
  },
  queueLink: {
    ...typography.uiAction,
    color: colors.primary,
    fontSize: 14,
  },
});
