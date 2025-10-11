import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Stack } from 'expo-router';

export default function LegalLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors['bg-elevated'],
        },
        headerTintColor: colors.text,
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
