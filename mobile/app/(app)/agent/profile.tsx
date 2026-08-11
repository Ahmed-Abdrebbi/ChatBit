import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui/Header';
import { Button } from '../../../src/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '../../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function AgentProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profil Agent" showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={48} color={colors.text} />
          </View>
          <Text style={styles.name}>Agent Alice</Text>
          <Text style={styles.email}>agent.alice@chatbit.com</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>En ligne</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Tickets résolus</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Note moyenne</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialIcons name="notifications-active" size={24} color={colors.text} />
            <Text style={styles.settingsItemText}>Notifications</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialIcons name="security" size={24} color={colors.text} />
            <Text style={styles.settingsItemText}>Sécurité</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </TouchableOpacity>
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
    backgroundColor: '#33a190', // Secondary container / success green
    marginRight: spacing.xs,
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
