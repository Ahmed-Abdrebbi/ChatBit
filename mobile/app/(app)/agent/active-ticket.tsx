import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../../src/theme';
import { useConversations } from '../../../src/hooks/useConversations';
import { Conversation } from '../../../src/api/conversations';

export default function AgentActiveTicketScreen() {
  const router = useRouter();
  const { conversations, isLoading } = useConversations();

  useEffect(() => {
    if (!isLoading) {
      const active = conversations.find((c: Conversation) => c.status === 'en_cours');
      if (active) {
        router.replace(`/(app)/agent/chat/${active.id}`);
      } else {
        router.replace('/(app)/agent/inbox');
      }
    }
  }, [conversations, isLoading, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
