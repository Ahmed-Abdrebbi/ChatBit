import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography } from '../src/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function SplashScreen() {
  const router = useRouter();
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

    // Navigate to Login after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.innerContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="chat-bubble" size={80} color={colors.primary} />
        </View>
        <Text style={styles.title}>ChatBit</Text>
        <Text style={styles.subtitle}>Votre compagnon de discussion.</Text>
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
});
