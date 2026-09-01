import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { SocketProvider } from '../src/context/SocketContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SocketProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(modals)/new-conversation" options={{ presentation: 'modal' }} />
        </Stack>
      </SocketProvider>
    </AuthProvider>
  );
}
