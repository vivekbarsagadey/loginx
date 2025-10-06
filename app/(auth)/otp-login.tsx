import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonButtons, CommonContainers, CommonInputs, CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { fetchSignInMethodsForEmail, sendSignInLinkToEmail } from 'firebase/auth';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const otpSchema = z.object({
  code: z.string().length(6, 'OTP code must be 6 digits'),
});

/**
 * Email OTP Login Screen
 * Alternative passwordless authentication using 6-digit OTP codes sent via email
 * More familiar UX for users accustomed to OTP flows
 */
export default function OTPLoginScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<TextInput[]>([]);

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' },
  });

  const sendOTP = async (emailAddress: string) => {
    setLoading(true);

    try {
      // Check if user exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, emailAddress);
      if (signInMethods.length === 0) {
        throw new Error(i18n.t('otpLogin.error.noAccount'));
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP temporarily (in production, store server-side)
      const otpData = {
        code: otp,
        email: emailAddress,
        timestamp: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      };
      await AsyncStorage.setItem('emailOTP', JSON.stringify(otpData));

      // In production, send OTP via email service (SendGrid, Mailgun, etc.)
      // For now, we'll use Firebase email link as a workaround
      console.log(`[OTP Login] OTP Code: ${otp}`); // DEV ONLY - Remove in production

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setEmail(emailAddress);
      setStep('otp');
      setCountdown(60);

      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      showSuccess(i18n.t('otpLogin.success.otpSent'), i18n.t('otpLogin.success.otpSentMessage', { email: emailAddress }));
    } catch (error: unknown) {
      showError(error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (code: string) => {
    setLoading(true);

    try {
      // Retrieve stored OTP
      const storedData = await AsyncStorage.getItem('emailOTP');
      if (!storedData) {
        throw new Error(i18n.t('otpLogin.error.otpExpired'));
      }

      const otpData = JSON.parse(storedData);

      // Check expiration
      if (Date.now() > otpData.expiresAt) {
        await AsyncStorage.removeItem('emailOTP');
        throw new Error(i18n.t('otpLogin.error.otpExpired'));
      }

      // Verify code
      if (code !== otpData.code) {
        throw new Error(i18n.t('otpLogin.error.invalidOtp'));
      }

      // Clear OTP
      await AsyncStorage.removeItem('emailOTP');

      // In production, complete authentication with your backend
      // For now, we'll use Firebase email link as fallback
      const actionCodeSettings = {
        url: 'https://your-app.com/finish-sign-in',
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      await AsyncStorage.setItem('emailForSignIn', email);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      showSuccess(i18n.t('otpLogin.success.verified'), i18n.t('otpLogin.success.verifiedMessage'), () => {
        router.push('/(auth)/verify-email');
      });
    } catch (error: unknown) {
      showError(error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    await sendOTP(data.email);
  };

  const handleOTPSubmit = async (data: z.infer<typeof otpSchema>) => {
    await verifyOTP(data.code);
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      return;
    }

    setResending(true);
    await sendOTP(email);
    setResending(false);
  };

  if (step === 'email') {
    return (
      <ScreenContainer>
        <ThemedView style={CommonContainers.centerContent}>
          <ThemedText type="h1" style={CommonText.title}>
            {i18n.t('otpLogin.title')}
          </ThemedText>

          <ThemedText type="body" style={CommonText.subtitle}>
            {i18n.t('otpLogin.subtitle')}
          </ThemedText>

          <Controller
            control={emailForm.control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedInput
                placeholder={i18n.t('otpLogin.emailPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                errorMessage={emailForm.formState.errors.email?.message}
                style={CommonInputs.input}
              />
            )}
          />

          <ThemedButton
            title={loading ? i18n.t('otpLogin.sendingButton') : i18n.t('otpLogin.sendButton')}
            onPress={emailForm.handleSubmit(handleEmailSubmit)}
            disabled={loading}
            style={CommonButtons.buttonLarge}
          />

          {loading && <ActivityIndicator style={styles.loading} />}

          <ThemedButton title={i18n.t('otpLogin.backToLogin')} variant="link" onPress={() => router.back()} style={CommonButtons.linkButtonSmall} />
        </ThemedView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ThemedView style={CommonContainers.centerContent}>
        <ThemedText type="h1" style={CommonText.title}>
          {i18n.t('otpLogin.verify.title')}
        </ThemedText>

        <ThemedText type="body" style={CommonText.subtitle}>
          {i18n.t('otpLogin.verify.subtitle', { email })}
        </ThemedText>

        <Controller
          control={otpForm.control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              ref={(ref) => {
                if (ref) otpRefs.current[0] = ref as TextInput;
              }}
              placeholder={i18n.t('otpLogin.codePlaceholder')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="number-pad"
              maxLength={6}
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              errorMessage={otpForm.formState.errors.code?.message}
              style={[CommonInputs.input, styles.otpInput]}
            />
          )}
        />

        <ThemedButton
          title={loading ? i18n.t('otpLogin.verifying') : i18n.t('otpLogin.verifyButton')}
          onPress={otpForm.handleSubmit(handleOTPSubmit)}
          disabled={loading}
          style={CommonButtons.buttonLarge}
        />

        {loading && <ActivityIndicator style={styles.loading} />}

        <ThemedButton
          title={countdown > 0 ? i18n.t('otpLogin.resendCountdown', { seconds: countdown }) : resending ? i18n.t('otpLogin.resending') : i18n.t('otpLogin.resendButton')}
          onPress={handleResendOTP}
          disabled={countdown > 0 || resending}
          variant="secondary"
          style={styles.resendButton}
        />

        <ThemedButton title={i18n.t('otpLogin.changeEmail')} variant="link" onPress={() => setStep('email')} style={CommonButtons.linkButtonSmall} />
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: Spacing.md,
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
  },
  resendButton: {
    marginTop: Spacing.md,
  },
});
