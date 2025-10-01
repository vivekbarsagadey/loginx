import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedInput } from '@/components/themed-input';
import { ThemedButton } from '@/components/themed-button';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import i18n from '@/i18n';
import { useState } from 'react';

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
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
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
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  requirementsContainer: {
    marginVertical: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  requirementsTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  requirement: {
    marginBottom: 4,
    opacity: 0.8,
  },
  changeButton: {
    marginTop: 16,
  },
  lastChanged: {
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
