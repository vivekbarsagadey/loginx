import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { Stack } from 'expo-router';

export default function NotificationsLayout() {
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
        name="index"
        options={{
          title: 'Notifications',
        }}
      />
    </Stack>
  );
}
