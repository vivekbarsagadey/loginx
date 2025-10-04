import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  const backgroundColor = useThemeColor({}, 'bg');
  const textColor = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: textColor,
        presentation: 'card',
        animation: ScreenTransitions.DEFAULT,
        animationDuration: AnimationDurations.SCREEN_TRANSITION,
      }}
    >
      <Stack.Screen
        name="theme"
        options={{
          title: 'Theme',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: 'Language',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="text-size"
        options={{
          title: 'Text Size',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          headerBackTitle: 'Settings',
        }}
      />
      <Stack.Screen
        name="about-us"
        options={{
          title: 'About Us',
          headerBackTitle: 'Settings',
        }}
      />
    </Stack>
  );
}
