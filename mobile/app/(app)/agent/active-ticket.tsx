import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TextInput, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Header } from '../../../src/components/ui/Header';
import { ChatBubble } from '../../../src/components/chat/ChatBubble';
import { colors, spacing, borderRadius, typography } from '../../../src/theme';
import { MaterialIcons } from '@expo/vector-icons';

const MOCK_MESSAGES = [
  { id: '1', text: 'Bonjour, j\'ai un problème avec ma connexion.', time: '10:00', isUser: false },
  { id: '2', text: 'Bonjour ! Je suis l\'Agent Alice. Pouvez-vous m\'en dire plus ?', time: '10:05', isUser: true },
];

export default function AgentActiveTicketScreen() {
  const router = useRouter();
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
      <Header 
        title="Ticket #123" 
        showBack 
        rightElement={
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Clôturer</Text>
          </TouchableOpacity>
        }
      />
      
      {/* Client Info Banner */}
      <View style={styles.infoBanner}>
        <MaterialIcons name="person" size={20} color={colors.text} style={styles.infoIcon} />
        <Text style={styles.infoText}>Client: Jean Dupont</Text>
      </View>

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
            placeholder="Répondre au client..."
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
  closeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  closeButtonText: {
    ...typography.bodySm,
    color: colors.text,
    fontWeight: '500',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  infoIcon: {
    marginRight: spacing.xs,
  },
  infoText: {
    ...typography.bodySm,
    color: colors.text,
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
