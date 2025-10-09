import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function RegisterLayout() {
  const backgroundColor = useThemeColor({}, 'bg-elevated');
  const textColor = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
