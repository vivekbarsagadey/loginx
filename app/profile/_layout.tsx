import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import i18n from '@/i18n';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
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
