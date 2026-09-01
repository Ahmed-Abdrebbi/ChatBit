import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui/Header';
import { ConversationItem } from '../../../src/components/ConversationItem';
import { colors, spacing, typography, borderRadius } from '../../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useConversations } from '../../../src/hooks/useConversations';
import { useAuth } from '../../../src/hooks/useAuth';

export default function ClientConversationsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { conversations, isLoading, isError, refetch } = useConversations();

  const handleNewConversation = () => {
    router.push('/(modals)/new-conversation');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Mes Conversations" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Mes Conversations" 
        rightElement={
          <TouchableOpacity onPress={handleLogout}>
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
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ConversationItem
                conversation={item}
                onPress={() => router.push(`/(app)/client/chat/${item.id}`)}
                showAgent
              />
            )}
            contentContainerStyle={styles.listContent}
            onRefresh={refetch}
            refreshing={isLoading}
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
