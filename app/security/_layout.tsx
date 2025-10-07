import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { Stack } from 'expo-router';

export default function SecurityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animation: ScreenTransitions.DEFAULT,
        animationDuration: AnimationDurations.SCREEN_TRANSITION,
      }}
    >
      <Stack.Screen
        name="2fa"
        options={{
          title: 'Two-Factor Authentication',
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: 'Change Password',
        }}
      />
      <Stack.Screen
        name="sessions"
        options={{
          title: 'Active Sessions',
        }}
      />
    </Stack>
  );
}
