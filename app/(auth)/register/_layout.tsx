
import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Register' }} />
      <Stack.Screen name="step-1" options={{ title: 'Step 1' }} />
      <Stack.Screen name="step-2" options={{ title: 'Step 2' }} />
      <Stack.Screen name="step-3" options={{ title: 'Step 3' }} />
    </Stack>
  );
}
