import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const requirements = i18n.t('screens.security.changePassword.requirements', { returnObjects: true }) as Record<string, string>;

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert(i18n.t('errors.generic.title'), 'Passwords do not match');
      return;
    }

    setLoading(true);
    // Simulate password change
    setTimeout(() => {
      setLoading(false);
      Alert.alert(i18n.t('success.profileUpdate.title'), i18n.t('screens.security.changePassword.success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  return (
    <ScreenContainer scrollable>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.security.changePassword.title')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('screens.security.changePassword.subtitle')}</ThemedText>

      <ThemedView style={styles.form}>
        <ThemedInput placeholder={i18n.t('screens.security.changePassword.currentPassword')} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry style={styles.input} />

        <ThemedInput placeholder={i18n.t('screens.security.changePassword.newPassword')} value={newPassword} onChangeText={setNewPassword} secureTextEntry style={styles.input} />

        <ThemedInput placeholder={i18n.t('screens.security.changePassword.confirmPassword')} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />

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
          title={i18n.t('screens.security.changePassword.changeButton')}
          onPress={handleChangePassword}
          disabled={loading || !currentPassword || !newPassword || !confirmPassword}
          style={styles.changeButton}
        />

        <ThemedText style={styles.lastChanged}>{i18n.t('screens.security.changePassword.lastChanged', { date: 'November 15, 2024' })}</ThemedText>
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.7,
  },
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
