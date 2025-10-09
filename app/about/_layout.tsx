import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function AboutLayout() {
  const backgroundColor = useThemeColor({}, 'bg-elevated');
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
        name="whats-new"
        options={{
          title: "What's New",
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
