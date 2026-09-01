import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { colors, spacing, typography, borderRadius } from '../../src/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);

      // After login, useAuth provides the user — route by role
      // We need to re-read the user from context after login resolves
      // The simplest approach: just navigate, the splash/root will redirect
      // But since login sets the user in context, we can check it here
      // However, the state update is async — let's rely on a simpler approach:
      // We navigate to index which will route based on role
      router.replace('/');
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'E-mail ou mot de passe incorrect.';
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
        <View style={styles.inner}>
          {/* Brand Lockup */}
          <View style={styles.brandContainer}>
            <MaterialIcons name="chat-bubble" size={64} color={colors.primary} />
          </View>

          {/* Heading & Subtext */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>Accédez à vos conversations.</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formSurface}>
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
            
            <View style={styles.buttonContainer}>
              <Button title="Se connecter" onPress={handleLogin} loading={loading} disabled={loading} />
            </View>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={16} color={colors.errorText} />
              <Text style={styles.errorBannerText}> {error}</Text>
            </View>
          ) : null}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ? </Text>
            <Link href="/(auth)/register" asChild>
              <Text style={styles.footerLink}>S'inscrire</Text>
            </Link>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.edge_margin,
  },
  brandContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
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
