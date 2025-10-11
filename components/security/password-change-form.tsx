import { ThemedInput } from '@/components/themed-input';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet, View } from 'react-native';

interface PasswordChangeFormProps {
  currentPassword: string;
  currentPasswordError: string;
  newPassword: string;
  newPasswordError: string;
  confirmPassword: string;
  confirmPasswordError: string;
  onCurrentPasswordChange: (text: string) => void;
  onNewPasswordChange: (text: string) => void;
  onConfirmPasswordChange: (text: string) => void;
  disabled?: boolean;
}

/**
 * Password Change Form Component
 * Handles the three password input fields with validation
 */
export function PasswordChangeForm({
  currentPassword,
  currentPasswordError,
  newPassword,
  newPasswordError,
  confirmPassword,
  confirmPasswordError,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  disabled = false,
}: PasswordChangeFormProps) {
  return (
    <View style={styles.container}>
      <ThemedInput
        label={i18n.t('screens.security.changePassword.currentPassword')}
        value={currentPassword}
        onChangeText={onCurrentPasswordChange}
        errorMessage={currentPasswordError}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
        accessibilityLabel="Current password input"
        accessibilityHint="Enter your current password"
      />

      <ThemedInput
        label={i18n.t('screens.security.changePassword.newPassword')}
        value={newPassword}
        onChangeText={onNewPasswordChange}
        errorMessage={newPasswordError}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
        accessibilityLabel="New password input"
        accessibilityHint="Enter your new password"
      />

      <ThemedInput
        label={i18n.t('screens.security.changePassword.confirmPassword')}
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        errorMessage={confirmPasswordError}
        secureTextEntry
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
        accessibilityLabel="Confirm password input"
        accessibilityHint="Re-enter your new password to confirm"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  input: {
    marginBottom: Spacing.sm,
  },
});
