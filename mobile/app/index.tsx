import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography } from '../src/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../src/hooks/useAuth';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    if (isLoading) return; // Wait for auth to finish loading

    const timer = setTimeout(() => {
      if (user) {
        // Route based on role
        if (user.role === 'agent') {
          router.replace('/(app)/agent/inbox');
        } else {
          router.replace('/(app)/client/conversations');
        }
      } else {
        router.replace('/(auth)/login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user, isLoading, router]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="chat-bubble" size={80} color={colors.primary} />
        </View>
        <Text style={styles.title}>ChatBit</Text>
        <Text style={styles.subtitle}>Votre compagnon de discussion.</Text>
        {isLoading && (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        )}
      </Animated.View>
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
  innerContainer: {
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
  loader: {
    marginTop: 24,
  },
});
