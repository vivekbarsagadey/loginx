import { ScreenContainer } from '@/components/screen-container';
import { PasswordChangeForm } from '@/components/security/password-change-form';
import { PasswordRequirements } from '@/components/security/password-requirements';
import { PasswordStrengthIndicator } from '@/components/security/password-strength-indicator';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { validatePassword } from '@/utils/password-validator';
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

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setNewPasswordError(validation.errors[0] || i18n.t('screens.security.changePassword.validation.requirementsNotMet'));
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
  }, [user, currentPassword, newPassword, confirmPassword]);

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
          <PasswordChangeForm
            currentPassword={currentPassword}
            currentPasswordError={currentPasswordError}
            newPassword={newPassword}
            newPasswordError={newPasswordError}
            confirmPassword={confirmPassword}
            confirmPasswordError={confirmPasswordError}
            onCurrentPasswordChange={(text) => {
              setCurrentPassword(text);
              if (currentPasswordError) {
                setCurrentPasswordError('');
              }
            }}
            onNewPasswordChange={(text) => {
              setNewPassword(text);
              if (newPasswordError) {
                setNewPasswordError('');
              }
            }}
            onConfirmPasswordChange={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) {
                setConfirmPasswordError('');
              }
            }}
            disabled={loading}
          />

          <PasswordStrengthIndicator password={newPassword} visible={newPassword.length > 0} />

          <PasswordRequirements password={newPassword} showIndicators={newPassword.length > 0} />

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
  changeButton: {
    marginTop: Spacing.lg,
  },
});
