import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import { Stack } from 'expo-router';

export default function SecurityLayout() {
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
        name="2fa"
        options={{
          title: i18n.t('navigation.titles.twoFactorAuth'),
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: i18n.t('navigation.titles.changePassword'),
        }}
      />
      <Stack.Screen
        name="sessions"
        options={{
          title: i18n.t('navigation.titles.activeSessions'),
        }}
      />
    </Stack>
  );
}
