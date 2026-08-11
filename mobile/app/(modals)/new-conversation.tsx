import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/ui/Header';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function NewConversationModal() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Demo
    router.replace('/(app)/client/chat/456');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Header title="Nouvelle Conversation" showBack />
          
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formSurface}>
              <Text style={styles.formTitle}>Comment pouvons-nous vous aider ?</Text>
              
              <Input
                label="Sujet"
                placeholder="Ex: Problème de facturation"
                value={subject}
                onChangeText={setSubject}
              />
              
              <Input
                label="Message"
                placeholder="Décrivez votre problème en détail..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                style={styles.textArea}
              />
              
              <View style={styles.buttonContainer}>
                <Button 
                  title="Démarrer la conversation" 
                  onPress={handleSubmit} 
                  disabled={!subject.trim() || !message.trim()}
                />
              </View>
            </View>
          </ScrollView>
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
  },
  scrollContent: {
    padding: spacing.md,
  },
  formSurface: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  formTitle: {
    ...typography.headerSm,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
