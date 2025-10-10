import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { validateEmailField } from '@/utils/form-validation';
import { sanitizeEmail } from '@/utils/sanitize';
import { showSuccess } from '@/utils/success';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { verifyBeforeUpdateEmail } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function UpdateEmailScreen() {
  const user = auth.currentUser;
  const router = useRouter();
  const alert = useAlert();
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);

  // Theme colors
  const warningColor = useThemeColor({}, 'warning');

  const validateEmail = useCallback(
    (email: string): boolean => {
      const result = validateEmailField(email);

      if (!result.isValid) {
        setEmailError(result.error || '');
        return false;
      }

      const sanitized = sanitizeEmail(email);
      if (sanitized === user?.email) {
        setEmailError(i18n.t('screens.updateEmail.errors.sameEmail'));
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
        setConfirmError(i18n.t('screens.updateEmail.errors.mismatch'));
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

      showSuccess(i18n.t('screens.updateEmail.success.title'), i18n.t('screens.updateEmail.success.message'), () => router.back());
    } catch (error: unknown) {
      console.error('Error updating email: ', error);

      // Handle specific Firebase errors
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        switch (firebaseError.code) {
          case 'auth/requires-recent-login':
            alert.show(i18n.t('screens.updateEmail.errors.reauthRequired.title'), i18n.t('screens.updateEmail.errors.reauthRequired.message'), [
              { text: i18n.t('screens.updateEmail.errors.reauthRequired.cancel'), style: 'cancel' },
              {
                text: i18n.t('screens.updateEmail.errors.reauthRequired.signOut'),
                onPress: () => {
                  auth.signOut();
                  router.replace('/(auth)/login');
                },
                style: 'destructive',
              },
            ]);
            break;
          case 'auth/email-already-in-use':
            setEmailError(i18n.t('screens.updateEmail.errors.emailInUse'));
            break;
          case 'auth/invalid-email':
            setEmailError(i18n.t('screens.updateEmail.errors.invalidEmail'));
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
  }, [user, newEmail, confirmEmail, validateEmail, validateConfirmEmail, router, alert]);

  const currentEmail = user?.email || '';

  return (
    <>
      <ScreenContainer scrollable keyboardAvoiding useSafeArea={false}>
        <ThemedView style={styles.header}>
          <ThemedText type="body" style={CommonText.subtitle}>
            {i18n.t('profile.updateEmail.subtitle') || 'Enter your new email address to update your account.'}
          </ThemedText>
        </ThemedView>

        {/* Current Email Display */}
        <ThemedView style={styles.currentEmailSection}>
          <ThemedText type="caption" style={CommonText.sectionTitle}>
            {i18n.t('screens.updateEmail.currentEmailLabel')}
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
            label={i18n.t('screens.updateEmail.newEmailLabel')}
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
            accessibilityLabel={i18n.t('screens.updateEmail.accessibility.newEmail')}
            accessibilityHint={i18n.t('screens.updateEmail.accessibility.newEmailHint')}
          />

          <ThemedInput
            label={i18n.t('screens.updateEmail.confirmEmailLabel')}
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
            accessibilityLabel={i18n.t('screens.updateEmail.accessibility.confirmEmail')}
            accessibilityHint={i18n.t('screens.updateEmail.accessibility.confirmEmailHint')}
          />
        </ThemedView>

        {/* Warning Notice */}
        <ThemedView style={styles.warningSection}>
          <ThemedView style={[styles.warningBox, { borderColor: warningColor, backgroundColor: warningColor + '10' }]}>
            <ThemedText type="caption" style={[styles.warningText, { color: warningColor }]}>
              {i18n.t('screens.updateEmail.warning.message')}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Actions */}
        <ThemedView style={styles.actionsSection}>
          <ThemedButton
            title={loading ? i18n.t('screens.updateEmail.updatingButton') : i18n.t('screens.updateEmail.updateButton')}
            onPress={handleUpdateEmail}
            disabled={loading || !newEmail || !confirmEmail || !!emailError || !!confirmError}
            loading={loading}
            variant="primary"
            accessibilityLabel={loading ? i18n.t('screens.updateEmail.accessibility.sendingHint') : i18n.t('screens.updateEmail.accessibility.updateButton')}
            accessibilityHint={loading ? i18n.t('screens.updateEmail.accessibility.sendingHint') : i18n.t('screens.updateEmail.accessibility.updateButtonHint')}
          />
        </ThemedView>
      </ScreenContainer>
      {alert.AlertComponent}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.xl,
  },
  currentEmailSection: {
    marginBottom: Spacing.lg,
  },
  currentEmailBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  currentEmailText: {
    fontFamily: 'monospace',
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  warningSection: {
    marginBottom: Spacing.xl,
  },
  warningBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  warningText: {
    lineHeight: 20,
  },
  actionsSection: {
    marginTop: 'auto',
    paddingBottom: Spacing.md,
  },
});
