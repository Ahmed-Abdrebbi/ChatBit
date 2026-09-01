import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui/Header';
import { Button } from '../../../src/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '../../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../src/hooks/useAuth';
import { useSocket } from '../../../src/hooks/useSocket';
import { useConversations } from '../../../src/hooks/useConversations';
import { Conversation } from '../../../src/api/conversations';

export default function AgentProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isConnected } = useSocket();
  const { conversations } = useConversations();

  const resolvedCount = conversations.filter((c: Conversation) => c.status === 'fermee').length;
  const activeCount = conversations.filter((c: Conversation) => c.status === 'en_cours').length;

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profil Agent" showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <MaterialIcons name="support-agent" size={48} color={colors.primary} />
          </View>
          <Text style={styles.name}>{user?.fullname || 'Agent'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, !isConnected && styles.statusDotOffline]} />
            <Text style={styles.statusText}>{isConnected ? 'En ligne' : 'Hors ligne'}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{resolvedCount}</Text>
            <Text style={styles.statLabel}>Tickets résolus</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{activeCount}</Text>
            <Text style={styles.statLabel}>Tickets en cours</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <View style={styles.settingsItem}>
            <MaterialIcons name="badge" size={24} color={colors.primaryHover} />
            <Text style={styles.settingsItemText}>Rôle : {user?.role === 'agent' ? 'Agent Support' : 'Client'}</Text>
          </View>
          <View style={styles.settingsItem}>
            <MaterialIcons name="fingerprint" size={24} color={colors.primaryHover} />
            <Text style={styles.settingsItemText}>ID Utilisateur : #{user?.id}</Text>
          </View>
        </View>
        
        <View style={styles.logoutContainer}>
          <Button 
            title="Se déconnecter" 
            onPress={handleLogout} 
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  name: {
    ...typography.displayTitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.bodyMd,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  statusDotOffline: {
    backgroundColor: colors.errorText,
  },
  statusText: {
    ...typography.statusLabel,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  statValue: {
    ...typography.displayTitle,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.bodySm,
    color: colors.muted,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headerSm,
    color: colors.text,
    marginBottom: spacing.md,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  settingsItemText: {
    ...typography.bodyMd,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.sm,
  },
  logoutContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  logoutButton: {
    backgroundColor: colors.surface,
    borderColor: colors.errorText,
    borderWidth: 1,
  },
});
