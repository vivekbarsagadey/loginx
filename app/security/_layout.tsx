import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function SecurityLayout() {
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
        name="2fa"
        options={{
          title: 'Two-Factor Authentication',
          headerBackTitle: 'Security',
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: 'Change Password',
          headerBackTitle: 'Security',
        }}
      />
      <Stack.Screen
        name="sessions"
        options={{
          title: 'Active Sessions',
          headerBackTitle: 'Security',
        }}
      />
    </Stack>
  );
}
