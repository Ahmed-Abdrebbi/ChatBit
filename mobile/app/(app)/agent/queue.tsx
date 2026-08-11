import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui/Header';
import { colors, spacing, typography, borderRadius } from '../../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../src/components/ui/Button';

const mockQueue = [
  { id: '1', client: 'Client Anonyme 1', subject: 'Demande d\'information', waitTime: '5 min' },
  { id: '2', client: 'Client Anonyme 2', subject: 'Problème technique', waitTime: '12 min' },
];

export default function AgentQueueScreen() {
  const router = useRouter();

  const handleTakeTicket = (id: string) => {
    router.push('/(app)/agent/active-ticket');
  };

  const renderItem = ({ item }: { item: typeof mockQueue[0] }) => (
    <View style={styles.queueCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.clientName}>{item.client}</Text>
        <Text style={styles.waitTime}>Attente: {item.waitTime}</Text>
      </View>
      <Text style={styles.subject} numberOfLines={1}>{item.subject}</Text>
      
      <View style={styles.actionContainer}>
        <Button 
          title="Prendre en charge" 
          onPress={() => handleTakeTicket(item.id)} 
          style={styles.takeButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="File d'attente" showBack />
      
      <FlatList
        data={mockQueue}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune demande en attente.</Text>
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
    color: colors.errorText,
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
