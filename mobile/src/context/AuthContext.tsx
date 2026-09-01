import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as authApi from '../api/auth';
import { getMe, User } from '../api/users';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (fullname: string, email: string, password: string, role: 'client' | 'agent') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // On mount: check SecureStore for existing token and restore session
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        if (storedToken) {
          // Validate the token by calling /api/users/me
          const user = await getMe();
          setState({ user, token: storedToken, isLoading: false });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch {
        // Token invalid/expired — clear it
        await SecureStore.deleteItemAsync('auth_token');
        setState({ user: null, token: null, isLoading: false });
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    await SecureStore.setItemAsync('auth_token', data.token);
    setState({ user: data.user, token: data.token, isLoading: false });
  }, []);

  const register = useCallback(
    async (fullname: string, email: string, password: string, role: 'client' | 'agent') => {
      const data = await authApi.register(fullname, email, password, role);
      await SecureStore.setItemAsync('auth_token', data.token);
      setState({ user: data.user, token: data.token, isLoading: false });
    },
    []
  );

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('auth_token');
    queryClient.clear();
    setState({ user: null, token: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
