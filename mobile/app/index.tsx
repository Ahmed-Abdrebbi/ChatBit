import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography } from '../src/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to Login after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <MaterialIcons name="chat-bubble" size={80} color={colors.primary} />
      </View>
      <Text style={styles.title}>ChatBit</Text>
      <Text style={styles.subtitle}>Votre compagnon de discussion.</Text>
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
  logoContainer: {
    marginBottom: 24,
  },
  title: {
    ...typography.displayTitle,
    color: colors.text,
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.muted,
  },
});
