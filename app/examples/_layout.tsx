import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Stack } from 'expo-router';

export default function ExamplesLayout() {
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
        name="dialogs"
        options={{
          title: 'Dialog Examples',
          headerBackTitle: 'Examples',
        }}
      />
      <Stack.Screen
        name="layered-surfaces"
        options={{
          title: 'Layered Surfaces',
          headerBackTitle: 'Examples',
        }}
      />
    </Stack>
  );
}
