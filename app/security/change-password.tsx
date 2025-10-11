import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { FontWeight, Spacing } from '@/constants/layout';
import { ValidationConstants } from '@/constants/validation';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function ChangePasswordScreen() {
  const { back } = useHapticNavigation();
  const alert = useAlert();
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const requirements = i18n.t('screens.security.changePassword.requirements', { returnObjects: true }) as Record<string, string>;

  const validatePassword = useCallback((password: string): boolean => {
    if (!password) {
      return false;
    }

    // Check minimum length
    if (password.length < ValidationConstants.PASSWORD_MIN_LENGTH) {
      return false;
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      return false;
    }

    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return false;
    }

    return true;
  }, []);

  // Validation function
  const validateForm = useCallback(() => {
    // Reset errors
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    if (!user || !user.email) {
      showError(new Error('No authenticated user found'));
      return false;
    }

    // Validate current password
    if (!currentPassword) {
      setCurrentPasswordError(i18n.t('screens.security.changePassword.validation.currentRequired'));
      return false;
    }

    // Validate new password
    if (!newPassword) {
      setNewPasswordError(i18n.t('screens.security.changePassword.validation.newRequired'));
      return false;
    }

    if (!validatePassword(newPassword)) {
      setNewPasswordError(i18n.t('screens.security.changePassword.validation.requirementsNotMet'));
      return false;
    }

    // Validate confirm password
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(i18n.t('screens.security.changePassword.validation.mismatch'));
      return false;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      setNewPasswordError(i18n.t('screens.security.changePassword.validation.sameAsOld'));
      return false;
    }

    return true;
  }, [user, currentPassword, newPassword, confirmPassword, validatePassword]);

  // Form submission with hook
  const { submit: handleChangePassword, isSubmitting: loading } = useFormSubmit(
    async () => {
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // Step 1: Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Step 2: Update password
      await updatePassword(user, newPassword);

      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    {
      successTitle: i18n.t('success.passwordChanged.title'),
      successMessage: i18n.t('success.passwordChanged.message'),
      onSuccess: () => back(),
      validate: validateForm,
      errorTitle: i18n.t('screens.security.changePassword.error.title'),
    }
  );

  return (
    <>
      <ScreenContainer scrollable useSafeArea={false}>
        <ThemedText style={CommonText.subtitle}>{i18n.t('screens.security.changePassword.subtitle')}</ThemedText>

        <ThemedView style={styles.form}>
          <ThemedInput
            label={i18n.t('screens.security.changePassword.currentPassword')}
            value={currentPassword}
            onChangeText={(text) => {
              setCurrentPassword(text);
              if (currentPasswordError) {
                setCurrentPasswordError('');
              }
            }}
            errorMessage={currentPasswordError}
            secureTextEntry
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <ThemedInput
            label={i18n.t('screens.security.changePassword.newPassword')}
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              if (newPasswordError) {
                setNewPasswordError('');
              }
            }}
            errorMessage={newPasswordError}
            secureTextEntry
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <ThemedInput
            label={i18n.t('screens.security.changePassword.confirmPassword')}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) {
                setConfirmPasswordError('');
              }
            }}
            errorMessage={confirmPasswordError}
            secureTextEntry
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <ThemedView style={styles.requirementsContainer}>
            <ThemedText type="h3" style={styles.requirementsTitle}>
              {requirements.title}
            </ThemedText>
            <ThemedText style={styles.requirement}>• {requirements.minLength}</ThemedText>
            <ThemedText style={styles.requirement}>• {requirements.uppercase}</ThemedText>
            <ThemedText style={styles.requirement}>• {requirements.lowercase}</ThemedText>
            <ThemedText style={styles.requirement}>• {requirements.numbers}</ThemedText>
            <ThemedText style={styles.requirement}>• {requirements.symbols}</ThemedText>
          </ThemedView>

          <ThemedButton
            title={loading ? i18n.t('screens.security.changePassword.changingButton') : i18n.t('screens.security.changePassword.changeButton')}
            onPress={handleChangePassword}
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            loading={loading}
            style={styles.changeButton}
          />
        </ThemedView>
      </ScreenContainer>
      {alert.AlertComponent}
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  input: {
    marginBottom: Spacing.md,
  },
  requirementsContainer: {
    marginVertical: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    // Background handled by theme
  },
  requirementsTitle: {
    marginBottom: Spacing.md,
    fontWeight: FontWeight.bold,
  },
  requirement: {
    marginBottom: Spacing.xs,
    opacity: 0.8,
  },
  changeButton: {
    marginTop: Spacing.md,
  },
  lastChanged: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
