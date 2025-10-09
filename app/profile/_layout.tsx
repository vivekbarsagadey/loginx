import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
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
        name="edit"
        options={{
          title: i18n.t('profile.edit.title'),
        }}
      />
      <Stack.Screen
        name="update-email"
        options={{
          title: i18n.t('profile.updateEmail.title'),
        }}
      />
    </Stack>
  );
}
