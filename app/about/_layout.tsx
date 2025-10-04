import { useThemeColor } from '@/hooks/use-theme-color';
import { Stack } from 'expo-router';

export default function AboutLayout() {
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
        animation: 'slide_from_right',
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
