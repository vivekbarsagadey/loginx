import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
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
        name="theme"
        options={{
          title: 'Theme',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: 'Language',
        }}
      />
      <Stack.Screen
        name="text-size"
        options={{
          title: 'Text Size',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="about-us"
        options={{
          title: 'About Us',
        }}
      />
    </Stack>
  );
}
