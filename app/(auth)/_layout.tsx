import { AnimationDurations, ScreenTransitions } from '@/constants/animation';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const backgroundColor = useThemeColor({}, 'bg-elevated');
  const textColor = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: textColor,
        animation: ScreenTransitions.DEFAULT,
        animationDuration: AnimationDurations.SCREEN_TRANSITION,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: i18n.t('navigation.titles.login'),
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: i18n.t('navigation.titles.forgotPassword'),
        }}
      />
      <Stack.Screen
        name="otp-login"
        options={{
          title: i18n.t('navigation.titles.otpLogin'),
        }}
      />
      <Stack.Screen
        name="passwordless-login"
        options={{
          title: i18n.t('navigation.titles.passwordlessLogin'),
        }}
      />
      <Stack.Screen
        name="verify-email"
        options={{
          title: i18n.t('navigation.titles.verifyEmail'),
        }}
      />
      <Stack.Screen
        name="verify-phone"
        options={{
          title: i18n.t('navigation.titles.verifyPhone'),
        }}
      />
      <Stack.Screen
        name="verify-2fa"
        options={{
          title: i18n.t('navigation.titles.verify2FA'),
        }}
      />
      <Stack.Screen
        name="verify-magic-link"
        options={{
          title: i18n.t('navigation.titles.verifyMagicLink'),
        }}
      />
      <Stack.Screen
        name="welcome"
        options={{
          title: i18n.t('navigation.titles.welcome'),
          headerShown: false,
        }}
      />
    </Stack>
  );
}
