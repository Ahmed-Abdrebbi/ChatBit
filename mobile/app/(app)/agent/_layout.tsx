import { Stack } from 'expo-router';

export default function AgentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="inbox" />
      <Stack.Screen name="queue" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="active-ticket" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
