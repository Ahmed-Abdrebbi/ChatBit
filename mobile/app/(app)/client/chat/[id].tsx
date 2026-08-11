import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '../../../../src/components/ui/Header';
import { ChatBubble } from '../../../../src/components/chat/ChatBubble';
import { colors, spacing, borderRadius, typography } from '../../../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';

const MOCK_MESSAGES = [
  { id: '1', text: 'Bonjour, j\'ai un problème avec ma connexion.', time: '10:00', isUser: true },
  { id: '2', text: 'Bonjour ! Je suis l\'Agent Alice. Pouvez-vous m\'en dire plus ?', time: '10:05', isUser: false },
  { id: '3', text: 'Je n\'arrive pas à me connecter depuis ce matin.', time: '10:06', isUser: true },
];

export default function ClientChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      id: Date.now().toString(),
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    }]);
    setNewMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Ticket #${id}`} showBack />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {messages.map(msg => (
            <ChatBubble 
              key={msg.id} 
              message={msg.text} 
              time={msg.time} 
              isUser={msg.isUser} 
            />
          ))}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrivez un message..."
            placeholderTextColor={colors.muted}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <MaterialIcons name="send" size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.inputBg,
    color: colors.text,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 48,
    maxHeight: 120,
    ...typography.bodyMd,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
