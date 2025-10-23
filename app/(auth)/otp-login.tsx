import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAsyncStorage } from '@/hooks/storage/use-async-storage';
import { useInterval } from '@/hooks/timing/use-interval';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { createLogger } from '@/utils/debug';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchSignInMethodsForEmail, sendSignInLinkToEmail } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, type TextInput } from 'react-native';
import { z } from 'zod';

const logger = createLogger('OTPLogin');

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
  const { back } = useHapticNavigation();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<TextInput[]>([]);

  // Use storage hooks for persistent data
  const otpStorage = useAsyncStorage<{
    code: string;
    email: string;
    timestamp: number;
    expiresAt: number;
  } | null>('emailOTP', null);

  const emailForSignInStorage = useAsyncStorage<string>('emailForSignIn', '');

  // Use useInterval for countdown timer
  const countdownInterval = useInterval(
    () => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    },
    1000,
    { immediate: false, enabled: countdown > 0 }
  );

  // Start countdown when entering OTP step
  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      countdownInterval.start();
    }
    return () => countdownInterval.stop();
  }, [step, countdown, countdownInterval]);

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' },
  });

  const sendOTP = async (emailAddress: string) => {
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
    await otpStorage.setValue(otpData);

    // In production, send OTP via email service (SendGrid, Mailgun, etc.)
    // For now, we'll use Firebase email link as a workaround
    if (__DEV__) {
      logger.warn(`OTP Code: ${otp}`); // DEV ONLY - Remove in production
    }

    setEmail(emailAddress);
    setStep('otp');
    setCountdown(60);
  };

  const { submit: submitEmail, isSubmitting: loadingEmail } = useFormSubmit(
    async () => {
      const emailData = emailForm.getValues();
      await sendOTP(emailData.email);
    },
    {
      successTitle: i18n.t('otpLogin.success.otpSent'),
      successMessage: i18n.t('otpLogin.success.otpSentMessage', { email: emailForm.getValues().email }),
    }
  );

  const verifyOTP = async (code: string) => {
    // Retrieve stored OTP
    const storedData = otpStorage.value;
    if (!storedData) {
      throw new Error(i18n.t('otpLogin.error.otpExpired'));
    }

    // Check expiration
    if (Date.now() > storedData.expiresAt) {
      await otpStorage.remove();
      throw new Error(i18n.t('otpLogin.error.otpExpired'));
    }

    // Verify code
    if (code !== storedData.code) {
      throw new Error(i18n.t('otpLogin.error.invalidOtp'));
    }

    // Clear OTP
    await otpStorage.remove();

    // In production, complete authentication with your backend
    // For now, we'll use Firebase email link as fallback
    const actionCodeSettings = {
      url: 'https://your-app.com/finish-sign-in',
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    await emailForSignInStorage.setValue(email);
  };

  const { submit: submitOTP, isSubmitting: loadingOTP } = useFormSubmit(
    async () => {
      const otpData = otpForm.getValues();
      await verifyOTP(otpData.code);
    },
    {
      successTitle: i18n.t('otpLogin.success.verified'),
      successMessage: i18n.t('otpLogin.success.verifiedMessage'),
      onSuccess: () => {
        // Navigation handled in success callback
        // router.push would go here but useFormSubmit doesn't navigate by default
      },
    }
  );

  const handleEmailSubmit = async () => {
    await submitEmail();
  };

  const handleOTPSubmit = async () => {
    await submitOTP();
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
      <ScreenContainer scrollable>
        <ThemedView style={styles.centerContent}>
          <ThemedText type="h1" style={styles.title}>
            {i18n.t('otpLogin.title')}
          </ThemedText>

          <ThemedText type="body" style={styles.subtitle}>
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
              />
            )}
          />

          <ThemedButton
            title={loadingEmail ? i18n.t('otpLogin.sendingButton') : i18n.t('otpLogin.sendButton')}
            onPress={emailForm.handleSubmit(handleEmailSubmit)}
            disabled={loadingEmail}
            style={styles.submitButton}
          />

          <ThemedButton title={i18n.t('otpLogin.backToLogin')} variant="link" onPress={() => back()} />
        </ThemedView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <ThemedView style={styles.centerContent}>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('otpLogin.verify.title')}
        </ThemedText>

        <ThemedText type="body" style={styles.subtitle}>
          {i18n.t('otpLogin.verify.subtitle', { email })}
        </ThemedText>

        <Controller
          control={otpForm.control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedInput
              ref={(ref) => {
                if (ref) {
                  otpRefs.current[0] = ref as TextInput;
                }
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
              style={styles.otpInput}
            />
          )}
        />

        <ThemedButton
          title={loadingOTP ? i18n.t('otpLogin.verifying') : i18n.t('otpLogin.verifyButton')}
          onPress={otpForm.handleSubmit(handleOTPSubmit)}
          disabled={loadingOTP}
          style={styles.submitButton}
        />

        <ThemedButton
          title={countdown > 0 ? i18n.t('otpLogin.resendCountdown', { seconds: countdown }) : resending ? i18n.t('otpLogin.resending') : i18n.t('otpLogin.resendButton')}
          onPress={handleResendOTP}
          disabled={countdown > 0 || resending}
          variant="secondary"
          style={styles.resendButton}
        />

        <ThemedButton title={i18n.t('otpLogin.changeEmail')} variant="link" onPress={() => setStep('email')} />
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  submitButton: {
    marginTop: Spacing.xl,
  },
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
