import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // For demo purposes, we'll just navigate or show error
    if (email === 'agent@chatbit.com') {
      router.replace('/(app)/agent/inbox');
    } else if (email) {
      router.replace('/(app)/client/conversations');
    } else {
      setError('E-mail ou mot de passe incorrect.');
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
            <View style={styles.logoPlaceholder} />
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
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword
            />
            
            <View style={styles.buttonContainer}>
              <Button title="Se connecter" onPress={handleLogin} />
            </View>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
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
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
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
    alignItems: 'flex-start',
  },
  errorBannerText: {
    ...typography.bodySm,
    color: colors.errorText,
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
