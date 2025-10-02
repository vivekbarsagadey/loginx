import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: 'card',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Register',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="step-1"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="step-2"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="step-3"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
