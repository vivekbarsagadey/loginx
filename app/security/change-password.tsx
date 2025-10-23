import { ScreenContainer } from '@/components/screen-container';
import { PasswordChangeForm } from '@/components/security/password-change-form';
import { PasswordRequirements } from '@/components/security/password-requirements';
import { PasswordStrengthIndicator } from '@/components/security/password-strength-indicator';
import { ReAuthPrompt } from '@/components/security/re-auth-prompt'; // TASK-074: Import re-auth prompt
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SuccessAnimation } from '@/components/ui/success-animation';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useForm } from '@/hooks/utility/use-form';
import { useToggle } from '@/hooks/utility/use-toggle';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { validatePassword } from '@/utils/password-validator';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { StyleSheet } from 'react-native';

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  [key: string]: unknown;
}

export default function ChangePasswordScreen() {
  const { back } = useHapticNavigation();
  const alert = useAlert();
  const user = auth.currentUser;

  // TASK-074: Re-authentication state - using useToggle for boolean states
  const [showReAuthPrompt, toggleReAuthPrompt] = useToggle(false);
  const [showSuccessAnimation, toggleSuccessAnimation] = useToggle(false);

  // Form state management with useForm hook
  const form = useForm<PasswordFormValues>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validations: {
      currentPassword: {
        required: true,
        requiredMessage: i18n.t('screens.security.changePassword.validation.currentRequired'),
      },
      newPassword: {
        required: true,
        requiredMessage: i18n.t('screens.security.changePassword.validation.newRequired'),
        validate: (value, values) => {
          const validation = validatePassword(value as string);
          if (!validation.isValid) {
            return validation.errors[0] || i18n.t('screens.security.changePassword.validation.requirementsNotMet');
          }

          // Check if new password is different from current
          if (values.currentPassword === value) {
            return i18n.t('screens.security.changePassword.validation.sameAsOld');
          }

          return null;
        },
      },
      confirmPassword: {
        required: true,
        validate: (value, values) => {
          if (value !== values.newPassword) {
            return i18n.t('screens.security.changePassword.validation.mismatch');
          }
          return null;
        },
      },
    },
  });

  // Form submission with hook
  const { submit: handleChangePassword, isSubmitting: loading } = useFormSubmit(
    async () => {
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // TASK-074: Trigger re-authentication prompt before password change
      toggleReAuthPrompt();
      return; // Just return, don't throw
    },
    {
      successTitle: i18n.t('success.passwordChanged.title'),
      successMessage: i18n.t('success.passwordChanged.message'),
      onSuccess: () => back(),
      validate: async () => form.validateForm(),
      errorTitle: i18n.t('screens.security.changePassword.error.title'),
    }
  );

  // TASK-074: Proceed with password change after successful re-authentication
  const handleReAuthSuccess = async () => {
    toggleReAuthPrompt();

    try {
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // Step 1: Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, form.values.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Step 2: Update password
      await updatePassword(user, form.values.newPassword);

      // Reset form
      form.reset();

      // Show success animation
      toggleSuccessAnimation();
    } catch (_error: unknown) {
      showError(error);
    }
  };

  // TASK-074: Handle re-auth cancellation
  const handleReAuthCancel = () => {
    toggleReAuthPrompt();
  };

  return (
    <>
      <ScreenContainer scrollable useSafeArea={false}>
        <ThemedText style={CommonText.subtitle}>{i18n.t('screens.security.changePassword.subtitle')}</ThemedText>

        <ThemedView style={styles.form}>
          <PasswordChangeForm
            currentPassword={form.values.currentPassword}
            currentPasswordError={(form.touched.currentPassword && form.errors.currentPassword) || ''}
            newPassword={form.values.newPassword}
            newPasswordError={(form.touched.newPassword && form.errors.newPassword) || ''}
            confirmPassword={form.values.confirmPassword}
            confirmPasswordError={(form.touched.confirmPassword && form.errors.confirmPassword) || ''}
            onCurrentPasswordChange={(text) => {
              form.setValue('currentPassword', text);
              if (form.errors.currentPassword) {
                form.setError('currentPassword', '');
              }
            }}
            onNewPasswordChange={(text) => {
              form.setValue('newPassword', text);
              if (form.errors.newPassword) {
                form.setError('newPassword', '');
              }
            }}
            onConfirmPasswordChange={(text) => {
              form.setValue('confirmPassword', text);
              if (form.errors.confirmPassword) {
                form.setError('confirmPassword', '');
              }
            }}
            disabled={loading}
          />

          <PasswordStrengthIndicator password={form.values.newPassword} visible={form.values.newPassword.length > 0} />

          <PasswordRequirements password={form.values.newPassword} showIndicators={form.values.newPassword.length > 0} />

          <ThemedButton
            title={loading ? i18n.t('screens.security.changePassword.changingButton') : i18n.t('screens.security.changePassword.changeButton')}
            onPress={handleChangePassword}
            disabled={loading || !form.values.currentPassword || !form.values.newPassword || !form.values.confirmPassword}
            loading={loading}
            style={styles.changeButton}
          />
        </ThemedView>
      </ScreenContainer>

      {/* TASK-074: Re-authentication prompt modal */}
      <ReAuthPrompt
        visible={showReAuthPrompt}
        onSuccess={handleReAuthSuccess}
        onCancel={handleReAuthCancel}
        reason={i18n.t('screens.security.changePassword.reauth.reason')}
        allowPasswordFallback={true}
        userEmail={user?.email || undefined}
        checkSessionTimeout={true}
      />

      {/* Success animation */}
      <SuccessAnimation
        visible={showSuccessAnimation}
        title={i18n.t('success.passwordChanged.title')}
        message={i18n.t('success.passwordChanged.message')}
        icon="shield-checkmark"
        onComplete={() => {
          toggleSuccessAnimation();
          back();
        }}
      />

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
