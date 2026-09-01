import api from './client';

export interface Conversation {
  id: number;
  subject: string;
  status: 'en_attente' | 'en_cours' | 'fermee';
  clientid: number;
  agentid: number | null;
  createdat: string;
  closedat: string | null;
  // Joined fields the backend may return
  client_fullname?: string;
  agent_fullname?: string;
}

export interface Message {
  id: number;
  conversationid: number;
  senderid: number;
  content: string;
  isread: boolean;
  sentat: string;
  sender_fullname?: string;
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get<{ conversations: Conversation[] }>('/api/conversations');
  return data.conversations;
}

export async function createConversation(subject: string): Promise<Conversation> {
  const { data } = await api.post<{ conversation: Conversation }>('/api/conversations', { subject });
  return data.conversation;
}

export async function getMessages(
  conversationId: number,
  before?: number
): Promise<Message[]> {
  const params: Record<string, number> = {};
  if (before) params.before = before;

  const { data } = await api.get<{ messages: Message[] }>(
    `/api/conversations/${conversationId}/messages`,
    { params }
  );
  return data.messages;
}

export async function assignConversation(conversationId: number): Promise<Conversation> {
  const { data } = await api.patch<{ conversation: Conversation }>(
    `/api/conversations/${conversationId}/assign`
  );
  return data.conversation;
}

export async function closeConversation(conversationId: number): Promise<Conversation> {
  const { data } = await api.patch<{ conversation: Conversation }>(
    `/api/conversations/${conversationId}/close`
  );
  return data.conversation;
}
