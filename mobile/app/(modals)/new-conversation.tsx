import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/ui/Header';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { colors, spacing, typography, borderRadius } from '../../src/theme';
import { useConversations } from '../../src/hooks/useConversations';
import { useSocket } from '../../src/hooks/useSocket';

export default function NewConversationModal() {
  const router = useRouter();
  const { createConversation } = useConversations();
  const { socket } = useSocket();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un sujet pour la conversation.');
      return;
    }

    setLoading(true);

    try {
      const newConv = await createConversation.mutateAsync(subject.trim());
      
      // If there was an initial message and socket is ready, we can send it
      if (message.trim() && socket) {
        socket.emit('message:send', {
          conversationId: newConv.id,
          content: message.trim(),
        });
      }

      router.replace(`/(app)/client/chat/${newConv.id}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Impossible de créer la conversation.';
      Alert.alert('Erreur', errorMsg);
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
          <Header title="Nouvelle Conversation" showBack />
          
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.formSurface}>
              <Text style={styles.formTitle}>Comment pouvons-nous vous aider ?</Text>
              
              <Input
                label="Sujet"
                placeholder="Ex: Problème de livraison commande #1234"
                value={subject}
                onChangeText={setSubject}
              />
              
              <Input
                label="Message initial (optionnel)"
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
                  loading={loading}
                  disabled={!subject.trim() || loading}
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
