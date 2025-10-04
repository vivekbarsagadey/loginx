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
        animation: 'slide_from_right',
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
    </Stack>
  );
}
