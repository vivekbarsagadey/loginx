import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Stack } from 'expo-router';

export default function AboutLayout() {
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
        name="whats-new"
        options={{
          title: "What's New",
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
