import api from './client';

export interface AuthResponse {
  user: {
    id: number;
    fullname: string;
    email: string;
    role: 'client' | 'agent';
    isonline: boolean;
    createdat: string;
  };
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password });
  return data;
}

export async function register(
  fullname: string,
  email: string,
  password: string,
  role: 'client' | 'agent'
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', {
    fullname,
    email,
    password,
    role,
  });
  return data;
}
