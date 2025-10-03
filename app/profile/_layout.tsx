import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
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
        name="edit"
        options={{
          title: i18n.t('profile.edit.title'),
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="update-email"
        options={{
          title: i18n.t('profile.updateEmail.title'),
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
