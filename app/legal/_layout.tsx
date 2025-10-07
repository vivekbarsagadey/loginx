import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function LegalLayout() {
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
        name="terms"
        options={{
          title: 'Terms of Service',
          headerBackTitle: 'Legal',
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Privacy Policy',
          headerBackTitle: 'Legal',
        }}
      />
      <Stack.Screen
        name="license"
        options={{
          title: 'License Information',
          headerBackTitle: 'Legal',
        }}
      />
      <Stack.Screen
        name="data-rights"
        options={{
          title: 'Your Data Rights',
          headerBackTitle: 'Legal',
        }}
      />
      <Stack.Screen
        name="cookies"
        options={{
          title: 'Cookie Policy',
          headerBackTitle: 'Legal',
        }}
      />
    </Stack>
  );
}
