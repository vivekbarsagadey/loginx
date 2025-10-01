import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Register' }} />
    </Stack>
  );
}
