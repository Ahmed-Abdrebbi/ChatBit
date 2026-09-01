import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { colors, spacing, typography, borderRadius } from '../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'client' | 'agent'>('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password, role);
      router.replace('/');
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Une erreur est survenue.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez-nous pour discuter.</Text>
          </View>

          <View style={styles.formSurface}>
            <Input
              label="Nom complet"
              placeholder="Jean Dupont"
              value={name}
              onChangeText={(text) => { setName(text); setError(''); }}
            />

            <Input
              label="Adresse e-mail"
              placeholder="vous@exemple.com"
              value={email}
              onChangeText={(text) => { setEmail(text); setError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => { setPassword(text); setError(''); }}
              isPassword
            />

            <Input
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
              isPassword
            />

            {/* Role Picker */}
            <Text style={styles.roleLabel}>Je suis :</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'client' && styles.roleButtonActive]}
                onPress={() => setRole('client')}
              >
                <MaterialIcons
                  name="person"
                  size={20}
                  color={role === 'client' ? colors.onPrimary : colors.text}
                />
                <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>
                  Client
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleButton, role === 'agent' && styles.roleButtonActive]}
                onPress={() => setRole('agent')}
              >
                <MaterialIcons
                  name="support-agent"
                  size={20}
                  color={role === 'agent' ? colors.onPrimary : colors.text}
                />
                <Text style={[styles.roleText, role === 'agent' && styles.roleTextActive]}>
                  Agent
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <Button title="S'inscrire" onPress={handleRegister} loading={loading} disabled={loading} />
            </View>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={16} color={colors.errorText} />
              <Text style={styles.errorBannerText}> {error}</Text>
            </View>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <Link href="/(auth)/login" asChild>
              <Text style={styles.footerLink}>Se connecter</Text>
            </Link>
          </View>
          
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.edge_margin,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    width: '100%',
  },
  title: {
    ...typography.displayTitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.muted,
  },
  formSurface: {
    backgroundColor: colors.surface,
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  roleLabel: {
    ...typography.bodySm,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBg,
    gap: 6,
  },
  roleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    ...typography.uiAction,
    color: colors.text,
    fontSize: 14,
  },
  roleTextActive: {
    color: colors.onPrimary,
  },
  buttonContainer: {
    marginTop: spacing.sm,
  },
  errorBanner: {
    width: '100%',
    marginTop: spacing.md,
    backgroundColor: colors.errorBg,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorBannerText: {
    ...typography.bodySm,
    color: colors.errorText,
    flex: 1,
  },
  footer: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    ...typography.bodySm,
    color: colors.muted,
  },
  footerLink: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: '500',
  },
});
