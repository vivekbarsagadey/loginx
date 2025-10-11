import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Stack } from 'expo-router';

export default function RegisterLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
