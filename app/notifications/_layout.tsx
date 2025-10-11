import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import { Stack } from 'expo-router';

export default function NotificationsLayout() {
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
          title: i18n.t('navigation.titles.notifications'),
        }}
      />
    </Stack>
  );
}
