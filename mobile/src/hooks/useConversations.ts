import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  createConversation,
  assignConversation,
  closeConversation,
  Conversation,
} from '../api/conversations';
import { useSocket } from './useSocket';

const CONVERSATIONS_KEY = ['conversations'];

/**
 * Hook for fetching and managing conversations.
 * Automatically invalidates the query when a `conversation:updated` event
 * is received via socket, keeping the list in sync in real time.
 */
export function useConversations() {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const query = useQuery<Conversation[]>({
    queryKey: CONVERSATIONS_KEY,
    queryFn: getConversations,
  });

  // Listen to real-time conversation updates from the server
  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdated = () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    };

    socket.on('conversation:updated', handleConversationUpdated);

    return () => {
      socket.off('conversation:updated', handleConversationUpdated);
    };
  }, [socket, queryClient]);

  const createMutation = useMutation({
    mutationFn: (subject: string) => createConversation(subject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });

  const assignMutation = useMutation({
    mutationFn: (conversationId: number) => assignConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });

  const closeMutation = useMutation({
    mutationFn: (conversationId: number) => closeConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createConversation: createMutation,
    assignConversation: assignMutation,
    closeConversation: closeMutation,
  };
}
