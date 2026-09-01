import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header } from '../../../../src/components/ui/Header';
import { MessageBubble } from '../../../../src/components/MessageBubble';
import { MessageInput } from '../../../../src/components/MessageInput';
import { TypingIndicator } from '../../../../src/components/TypingIndicator';
import { colors, spacing, typography, borderRadius } from '../../../../src/theme';
import { useMessages } from '../../../../src/hooks/useMessages';
import { useConversations } from '../../../../src/hooks/useConversations';
import { useAuth } from '../../../../src/hooks/useAuth';
import { Message } from '../../../../src/api/conversations';

export default function AgentChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const router = useRouter();
  const { user } = useAuth();
  const { closeConversation } = useConversations();
  const {
    messages,
    isLoading,
    sendMessage,
    startTyping,
    stopTyping,
    isOtherTyping,
    isClosed,
  } = useMessages(conversationId);

  const [closing, setClosing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleCloseTicket = () => {
    Alert.alert(
      'Clôturer la conversation',
      'Êtes-vous sûr de vouloir fermer ce ticket ? Le client ne pourra plus envoyer de messages.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer la clôture',
          style: 'destructive',
          onPress: async () => {
            setClosing(true);
            try {
              await closeConversation.mutateAsync(conversationId);
              Alert.alert('Succès', 'La conversation a été clôturée.');
            } catch (err: any) {
              const msg = err.response?.data?.message || err.message || 'Erreur lors de la clôture';
              Alert.alert('Erreur', msg);
            } finally {
              setClosing(false);
            }
          },
        },
      ]
    );
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={`Ticket #${id}`} showBack />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={`Ticket #${id}`} 
        showBack 
        rightElement={
          !isClosed ? (
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleCloseTicket}
              disabled={closing}
            >
              <Text style={styles.closeButtonText}>
                {closing ? 'Fermeture...' : 'Clôturer'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.closedBadge}>
              <Text style={styles.closedBadgeText}>Fermé</Text>
            </View>
          )
        }
      />

      {isClosed && (
        <View style={styles.closedBanner}>
          <Text style={styles.closedText}>Ce ticket est clôturé. Aucun nouveau message ne peut être envoyé.</Text>
        </View>
      )}
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg: Message) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              time={formatTime(msg.sentat)}
              isOwn={msg.senderid === user?.id}
              senderName={msg.senderid !== user?.id ? (msg.sender_fullname || 'Client') : undefined}
              isRead={msg.isread}
            />
          ))}
          <TypingIndicator isVisible={isOtherTyping} />
        </ScrollView>
        
        <MessageInput
          onSend={sendMessage}
          onTypingStart={startTyping}
          onTypingStop={stopTyping}
          disabled={isClosed}
          placeholder="Répondre au client..."
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(226, 87, 76, 0.15)',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.errorText,
  },
  closeButtonText: {
    ...typography.bodySm,
    color: colors.errorText,
    fontWeight: '600',
  },
  closedBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.sm,
  },
  closedBadgeText: {
    ...typography.bodySm,
    color: colors.muted,
  },
  closedBanner: {
    backgroundColor: colors.errorBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  closedText: {
    ...typography.bodySm,
    color: colors.errorText,
    textAlign: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
});
