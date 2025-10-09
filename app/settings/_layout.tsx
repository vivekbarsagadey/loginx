import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  const backgroundColor = useThemeColor({}, 'bg');
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
        name="theme"
        options={{
          title: i18n.t('navigation.titles.theme'),
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: i18n.t('navigation.titles.language'),
        }}
      />
      <Stack.Screen
        name="text-size"
        options={{
          title: i18n.t('navigation.titles.textSize'),
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: i18n.t('navigation.titles.notifications'),
        }}
      />
      <Stack.Screen
        name="about-us"
        options={{
          title: i18n.t('navigation.titles.aboutUs'),
        }}
      />
    </Stack>
  );
}
