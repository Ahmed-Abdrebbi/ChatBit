import { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages, Message, Conversation } from '../api/conversations';
import { useSocket } from './useSocket';

/**
 * Hook for managing messages in a conversation.
 * - Loads history via REST (TanStack Query)
 * - Joins the socket room on mount, leaves on unmount
 * - Listens for real-time `message:new` and appends to cache
 * - Listens for `typing:update` and exposes `isOtherTyping`
 * - Listens for `conversation:updated` to track closed status
 * - Provides `sendMessage()`, `startTyping()`, `stopTyping()`
 */
export function useMessages(conversationId: number) {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [conversationStatus, setConversationStatus] = useState<string>('en_cours');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messagesKey = ['messages', conversationId];

  const query = useQuery<Message[]>({
    queryKey: messagesKey,
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });

  // Join/leave socket room
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit('conversation:join', { conversationId }, (response: { ok: boolean }) => {
      if (!response?.ok) {
        console.warn('Failed to join conversation room:', conversationId);
      }
    });

    return () => {
      socket.emit('conversation:leave', { conversationId });
    };
  }, [socket, conversationId]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (message.conversationid !== conversationId) return;

      queryClient.setQueryData<Message[]>(messagesKey, (old: Message[] | undefined) => {
        if (!old) return [message];
        // Avoid duplicates
        if (old.some((m: Message) => m.id === message.id)) return old;
        return [...old, message];
      });

      // Clear typing indicator when a message arrives
      setIsOtherTyping(false);
    };

    socket.on('message:new', handleNewMessage);

    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [socket, conversationId, queryClient]);

  // Listen for typing updates
  useEffect(() => {
    if (!socket) return;

    const handleTypingUpdate = (payload: { userId: number; isTyping: boolean }) => {
      setIsOtherTyping(payload.isTyping);

      // Auto-clear typing after 3 seconds of no update (safety net)
      if (payload.isTyping) {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsOtherTyping(false);
        }, 3000);
      }
    };

    socket.on('typing:update', handleTypingUpdate);

    return () => {
      socket.off('typing:update', handleTypingUpdate);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [socket]);

  // Listen for conversation status updates (close)
  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdated = (conversation: Conversation) => {
      if (conversation.id === conversationId) {
        setConversationStatus(conversation.status);
      }
    };

    socket.on('conversation:updated', handleConversationUpdated);

    return () => {
      socket.off('conversation:updated', handleConversationUpdated);
    };
  }, [socket, conversationId]);

  // Send a message
  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !content.trim()) return;
      socket.emit('message:send', { conversationId, content: content.trim() });
    },
    [socket, conversationId]
  );

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!socket) return;
    socket.emit('typing:start', { conversationId });
  }, [socket, conversationId]);

  const stopTyping = useCallback(() => {
    if (!socket) return;
    socket.emit('typing:stop', { conversationId });
  }, [socket, conversationId]);

  return {
    messages: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    sendMessage,
    startTyping,
    stopTyping,
    isOtherTyping,
    isClosed: conversationStatus === 'fermee',
  };
}
