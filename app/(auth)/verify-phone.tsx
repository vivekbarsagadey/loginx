import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonButtons, CommonContainers, CommonText } from '@/constants/common-styles';
import { Spacing, Typography } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useAutoFocus } from '@/hooks/use-auto-focus';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, type TextInput, View } from 'react-native';

/**
 * Phone Verification Screen
 * Handles SMS OTP verification for phone number
 */
export default function VerifyPhoneScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const alert = useAlert();

  const [verificationCode, setVerificationCode] = useState('');
  const [_verificationId, setVerificationId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const codeRef = useRef<TextInput>(null);

  // Auto-focus code input
  useAutoFocus(codeRef);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Send verification code
  useEffect(() => {
    sendVerificationCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendVerificationCode = async () => {
    if (!phoneNumber) {
      showError('Phone number is required');
      router.back();
      return;
    }

    setResending(true);

    try {
      // Note: Phone verification requires reCAPTCHA verification on web
      // For React Native, you'd need to use Firebase phone authentication
      // This is a simplified implementation - in production, use Firebase's RecaptchaVerifier

      // For now, we'll show a mock implementation
      // In production, implement proper phone auth flow:
      // 1. Set up reCAPTCHA verifier (web) or use invisible reCAPTCHA (native)
      // 2. Call signInWithPhoneNumber or verifyPhoneNumber
      // 3. Get verificationId

      console.warn('[PhoneVerification] Phone verification requires additional setup');
      console.warn('[PhoneVerification] See: https://firebase.google.com/docs/auth/web/phone-auth');

      // Mock verification ID for demo purposes
      setVerificationId('mock-verification-id');

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCountdown(60);

      alert.show('Demo Mode', `In production, an SMS would be sent to ${phoneNumber}. For demo purposes, use code: 123456`, [{ text: 'OK' }]);
    } catch (error) {
      console.error('[PhoneVerification] Error sending code:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
    } finally {
      setResending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      showError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      showError('Verification code must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      // In production, use PhoneAuthProvider credential
      // const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      // await linkWithCredential(user, credential);

      // Mock verification for demo
      if (verificationCode === '123456') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showSuccess('Success', 'Phone number verified successfully!', () => {
          router.replace('/(tabs)');
        });
      } else {
        throw new Error('Invalid verification code. Use 123456 for demo.');
      }
    } catch (error) {
      console.error('[PhoneVerification] Error verifying code:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    alert.show('Skip Verification?', 'You can add and verify your phone number later in settings.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Skip',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <ThemedView style={CommonContainers.screenContainer}>
      <View style={styles.content}>
        <ThemedText type="h1" style={CommonText.title}>
          Verify Your Phone
        </ThemedText>
        <ThemedText style={styles.subtitle}>We&apos;ve sent a 6-digit verification code to:</ThemedText>
        <ThemedText style={styles.phoneNumber}>{phoneNumber}</ThemedText>

        <ThemedInput
          ref={codeRef}
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          autoFocus
          textContentType="oneTimeCode"
          accessibilityLabel="Verification code input"
          accessibilityHint="Enter the 6-digit code sent to your phone"
        />

        <View style={styles.resendContainer}>
          <ThemedText type="caption" style={styles.resendText}>
            Didn&apos;t receive the code?
          </ThemedText>
          <ThemedButton title={countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'} variant="link" onPress={sendVerificationCode} disabled={countdown > 0 || resending} loading={resending} />
        </View>

        <ThemedButton title="Verify" onPress={handleVerifyCode} loading={loading} disabled={loading || verificationCode.length !== 6} style={CommonButtons.button} />

        <ThemedButton title="Skip for Now" variant="link" onPress={handleSkip} style={CommonButtons.linkButtonSmall} />
      </View>
      {alert.AlertComponent}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  phoneNumber: {
    textAlign: 'center',
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.md,
  },
  input: {
    fontSize: Typography.h1.fontSize,
    textAlign: 'center',
    letterSpacing: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  resendText: {
    opacity: 0.7,
  },
});
