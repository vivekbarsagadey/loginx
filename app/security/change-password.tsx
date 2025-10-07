import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { ValidationConstants } from '@/constants/validation';
import { auth } from '@/firebase-config';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleChangePassword = useCallback(async () => {
    if (!user || !user.email) {
      showError(new Error('No authenticated user found'));
      return;
    }

    // Reset errors
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    // Validate current password
    if (!currentPassword) {
      setCurrentPasswordError('Current password is required');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Validate new password
    if (!newPassword) {
      setNewPasswordError('New password is required');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!validatePassword(newPassword)) {
      setNewPasswordError('Password does not meet security requirements');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Validate confirm password
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      setNewPasswordError('New password must be different from current password');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);

    try {
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Step 1: Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Step 2: Update password
      await updatePassword(user, newPassword);

      // Success haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      showSuccess(i18n.t('success.profileUpdate.title'), i18n.t('screens.security.changePassword.success'), () => router.back());
    } catch (error: unknown) {
      console.error('[ChangePassword] Error changing password:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Handle specific Firebase errors
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/wrong-password') {
        setCurrentPasswordError('Current password is incorrect');
      } else if (firebaseError.code === 'auth/weak-password') {
        setNewPasswordError('Password is too weak');
      } else if (firebaseError.code === 'auth/requires-recent-login') {
        Alert.alert('Session Expired', 'For security reasons, please log out and log back in before changing your password.', [{ text: 'OK' }]);
      } else {
        showError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [user, currentPassword, newPassword, confirmPassword, validatePassword, router]);

  return (
    <>
      <TabHeader title="Change Password" showBackButton={true} />
      <ScreenContainer scrollable useSafeArea={false}>
        <ThemedText type="h1" style={CommonText.title}>
          {i18n.t('screens.security.changePassword.title')}
        </ThemedText>
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
            title={loading ? 'Changing Password...' : i18n.t('screens.security.changePassword.changeButton')}
            onPress={handleChangePassword}
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            loading={loading}
            style={styles.changeButton}
          />
        </ThemedView>
      </ScreenContainer>
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
    fontWeight: 'bold',
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
