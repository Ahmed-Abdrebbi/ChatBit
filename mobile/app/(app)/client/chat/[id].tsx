import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '../../../../src/components/ui/Header';
import { MessageBubble } from '../../../../src/components/MessageBubble';
import { MessageInput } from '../../../../src/components/MessageInput';
import { TypingIndicator } from '../../../../src/components/TypingIndicator';
import { colors, spacing, typography } from '../../../../src/theme';
import { useMessages } from '../../../../src/hooks/useMessages';
import { useAuth } from '../../../../src/hooks/useAuth';
import { Message } from '../../../../src/api/conversations';

export default function ClientChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const { user } = useAuth();
  const {
    messages,
    isLoading,
    sendMessage,
    startTyping,
    stopTyping,
    isOtherTyping,
    isClosed,
  } = useMessages(conversationId);

  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={`Conversation #${id}`} showBack />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Conversation #${id}`} showBack />

      {isClosed && (
        <View style={styles.closedBanner}>
          <Text style={styles.closedText}>Cette conversation a été fermée par l'agent.</Text>
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
              senderName={msg.senderid !== user?.id ? msg.sender_fullname : undefined}
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
