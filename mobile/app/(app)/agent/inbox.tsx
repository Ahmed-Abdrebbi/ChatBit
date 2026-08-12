import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui/Header';
import { colors, spacing, typography, borderRadius } from '../../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';

const mockInbox = [
  { id: '1', client: 'Jean Dupont', subject: 'Problème de connexion', time: '10:30', unread: true },
  { id: '2', client: 'Marie Curie', subject: 'Facturation double', time: 'Hier', unread: false },
];

export default function AgentInboxScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof mockInbox[0] }) => (
    <TouchableOpacity 
      style={[styles.inboxCard, item.unread && styles.inboxCardUnread]}
      onPress={() => router.push('/(app)/agent/active-ticket')}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.clientName, item.unread && styles.textUnread]}>{item.client}</Text>
        <Text style={[styles.time, item.unread && styles.textUnread]}>{item.time}</Text>
      </View>
      <Text style={[styles.subject, item.unread && styles.textUnread]} numberOfLines={1}>
        {item.subject}
      </Text>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Boîte de réception" 
        rightElement={
          <View style={styles.headerActions}>
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
        data={mockInbox}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
  },
  inboxCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    position: 'relative',
  },
  inboxCardUnread: {
    borderColor: colors.primary,
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
  time: {
    ...typography.timestamp,
    color: colors.muted,
  },
  subject: {
    ...typography.bodyMd,
    color: colors.muted,
  },
  textUnread: {
    fontWeight: '600',
    color: colors.text,
  },
  unreadDot: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
