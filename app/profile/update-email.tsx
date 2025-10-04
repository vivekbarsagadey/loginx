import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase-config';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { sanitizeEmail } from '@/utils/sanitize';
import { showSuccess } from '@/utils/success';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { verifyBeforeUpdateEmail } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

export default function UpdateEmailScreen() {
  const user = auth.currentUser;
  const router = useRouter();
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);

  // Theme colors
  const warningColor = useThemeColor({}, 'warning');

  const validateEmail = useCallback(
    (email: string): boolean => {
      const sanitized = sanitizeEmail(email);
      if (!sanitized) {
        setEmailError(i18n.t('errors.validation.invalidEmail'));
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitized)) {
        setEmailError(i18n.t('errors.validation.invalidEmail'));
        return false;
      }

      if (sanitized === user?.email) {
        setEmailError('New email must be different from current email');
        return false;
      }

      setEmailError('');
      return true;
    },
    [user?.email]
  );

  const validateConfirmEmail = useCallback(
    (confirmEmail: string): boolean => {
      if (confirmEmail !== newEmail) {
        setConfirmError('Email addresses do not match');
        return false;
      }
      setConfirmError('');
      return true;
    },
    [newEmail]
  );

  const handleUpdateEmail = useCallback(async () => {
    if (!user) {
      showError(new Error('No authenticated user'));
      return;
    }

    const sanitizedEmail = sanitizeEmail(newEmail);
    if (!validateEmail(sanitizedEmail) || !validateConfirmEmail(confirmEmail)) {
      return;
    }

    setLoading(true);

    try {
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Use verifyBeforeUpdateEmail for better security
      await verifyBeforeUpdateEmail(user, sanitizedEmail);

      showSuccess('Verification Email Sent', 'Please check your new email address and click the verification link to complete the email update.', () => router.back());
    } catch (error: unknown) {
      console.error('Error updating email: ', error);

      // Handle specific Firebase errors
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        switch (firebaseError.code) {
          case 'auth/requires-recent-login':
            Alert.alert('Re-authentication Required', 'For security reasons, please log out and log back in before changing your email address.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Sign Out',
                onPress: () => {
                  auth.signOut();
                  router.replace('/(auth)/login');
                },
                style: 'destructive',
              },
            ]);
            break;
          case 'auth/email-already-in-use':
            setEmailError('This email is already associated with another account');
            break;
          case 'auth/invalid-email':
            setEmailError('Invalid email address');
            break;
          default:
            showError(error);
        }
      } else {
        showError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [user, newEmail, confirmEmail, validateEmail, validateConfirmEmail, router]);

  const currentEmail = user?.email || '';

  return (
    <ScreenContainer scrollable keyboardAvoiding>
      <ThemedView style={styles.header}>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('profile.updateEmail.title') || 'Update Email Address'}
        </ThemedText>
        <ThemedText type="body" style={styles.subtitle}>
          {i18n.t('profile.updateEmail.subtitle') || 'Enter your new email address to update your account.'}
        </ThemedText>
      </ThemedView>

      {/* Current Email Display */}
      <ThemedView style={styles.currentEmailSection}>
        <ThemedText type="caption" style={styles.sectionLabel}>
          Current Email
        </ThemedText>
        <ThemedView style={[styles.currentEmailBox, { borderColor: warningColor + '40', backgroundColor: warningColor + '10' }]}>
          <ThemedText type="body" style={styles.currentEmailText}>
            {currentEmail}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* New Email Form */}
      <ThemedView style={styles.formSection}>
        <ThemedInput
          label="New Email Address"
          value={newEmail}
          onChangeText={(text) => {
            setNewEmail(text);
            if (emailError) {
              setEmailError('');
            }
          }}
          onBlur={() => validateEmail(newEmail)}
          errorMessage={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          returnKeyType="next"
          accessible={true}
          accessibilityLabel="New email address input"
          accessibilityHint="Enter your new email address"
        />

        <ThemedInput
          label="Confirm New Email"
          value={confirmEmail}
          onChangeText={(text) => {
            setConfirmEmail(text);
            if (confirmError) {
              setConfirmError('');
            }
          }}
          onBlur={() => validateConfirmEmail(confirmEmail)}
          errorMessage={confirmError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleUpdateEmail}
          accessible={true}
          accessibilityLabel="Confirm new email address input"
          accessibilityHint="Re-enter your new email address to confirm"
        />
      </ThemedView>

      {/* Warning Notice */}
      <ThemedView style={styles.warningSection}>
        <ThemedView style={[styles.warningBox, { borderColor: warningColor, backgroundColor: warningColor + '10' }]}>
          <ThemedText type="caption" style={[styles.warningText, { color: warningColor }]}>
            ⚠️ Important: You will need to verify your new email address before the change takes effect. Make sure you have access to the new email account.
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Actions */}
      <ThemedView style={styles.actionsSection}>
        <ThemedButton
          title={loading ? 'Sending Verification...' : 'Update Email Address'}
          onPress={handleUpdateEmail}
          disabled={loading || !newEmail || !confirmEmail || !!emailError || !!confirmError}
          loading={loading}
          variant="primary"
          accessibilityLabel={loading ? 'Sending email verification' : 'Update email address'}
          accessibilityHint={loading ? 'Please wait while verification email is being sent' : 'Tap to update your email address'}
        />
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.8,
  },
  currentEmailSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  currentEmailBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  currentEmailText: {
    fontFamily: 'monospace',
  },
  formSection: {
    marginBottom: 24,
  },
  warningSection: {
    marginBottom: 32,
  },
  warningBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  warningText: {
    lineHeight: 20,
  },
  actionsSection: {
    marginTop: 'auto',
    paddingBottom: 16,
  },
});
