import api from './client';

export interface User {
  id: number;
  fullname: string;
  email: string;
  role: 'client' | 'agent';
  isonline: boolean;
  createdat: string;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/api/users/me');
  return data.user;
}
