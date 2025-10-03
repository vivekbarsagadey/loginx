import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';

export default function TwoFactorAuthScreen() {
  const { isEnabled, backupCodes, isLoading, error, enableTwoFactor, disableTwoFactor, generateBackupCodes, backupCodesCount, isBackupCodesLow, formatBackupCode } = useTwoFactorAuth();

  const { isAvailable: biometricAvailable, isEnabled: biometricEnabled, biometricTypeName, enableBiometric, disableBiometric, isLoading: biometricLoading } = useBiometricAuth();

  const errorColor = useThemeColor({}, 'error');
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const surfaceVariant = useThemeColor({}, 'surface-variant');

  const benefits = i18n.t('screens.security.twoFactor.notEnabled.benefits', { returnObjects: true }) as string[];

  const handleEnable2FA = async () => {
    try {
      const success = await enableTwoFactor();
      if (success) {
        showSuccess('2FA Enabled', '2FA has been successfully enabled for your account');
      }
    } catch (err) {
      showError(err);
    }
  };

  const handleDisable2FA = async () => {
    Alert.alert('Disable 2FA', 'Are you sure you want to disable two-factor authentication? This will reduce the security of your account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disable',
        style: 'destructive',
        onPress: async () => {
          try {
            await disableTwoFactor();
            showSuccess('2FA Disabled', '2FA has been disabled for your account');
          } catch (err) {
            showError(err);
          }
        },
      },
    ]);
  };

  const handleShowBackupCodes = () => {
    const formattedCodes = backupCodes.map((code) => formatBackupCode(code)).join('\n');
    Alert.alert(`Backup Codes (${backupCodesCount})`, `Save these codes in a secure location:\n\n${formattedCodes}`, [{ text: 'OK' }]);
  };

  const handleGenerateNewBackupCodes = async () => {
    Alert.alert('Generate New Backup Codes', 'This will invalidate all existing backup codes. Make sure to save the new codes.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Generate',
        onPress: async () => {
          try {
            await generateBackupCodes();
            showSuccess('New Codes Generated', 'Your backup codes have been regenerated');
          } catch (err) {
            showError(err);
          }
        },
      },
    ]);
  };

  const handleToggleBiometric = async (enabled: boolean) => {
    try {
      if (enabled) {
        const success = await enableBiometric();
        if (success) {
          showSuccess('Biometric Enabled', `${biometricTypeName} authentication has been enabled`);
        }
      } else {
        await disableBiometric();
        showSuccess('Biometric Disabled', `${biometricTypeName} authentication has been disabled`);
      }
    } catch (err) {
      showError(err);
    }
  };

  if (isLoading || biometricLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading security settings...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={[styles.errorText, { color: errorColor }]}>Error: {error}</ThemedText>
        <ThemedButton title="Retry" onPress={() => window.location.reload()} />
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('screens.security.twoFactor.title')}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{i18n.t('screens.security.twoFactor.subtitle')}</ThemedText>

        {/* Biometric Authentication Section */}
        {biometricAvailable && (
          <ThemedView style={styles.section}>
            <ThemedText type="h3" style={[styles.sectionTitle, { color: primaryColor }]}>
              {biometricTypeName} Authentication
            </ThemedText>
            <ThemedText style={styles.description}>Use {biometricTypeName.toLowerCase()} to quickly and securely access your account.</ThemedText>
            <View style={[styles.switchContainer, { backgroundColor: surfaceVariant }]}>
              <ThemedText>Enable {biometricTypeName}</ThemedText>
              <Switch value={biometricEnabled} onValueChange={handleToggleBiometric} disabled={biometricLoading} />
            </View>
          </ThemedView>
        )}

        {/* 2FA Section */}
        {!isEnabled ? (
          <ThemedView style={styles.section}>
            <ThemedText type="h3" style={[styles.sectionTitle, { color: primaryColor }]}>
              {i18n.t('screens.security.twoFactor.notEnabled.title')}
            </ThemedText>
            <ThemedText style={styles.description}>{i18n.t('screens.security.twoFactor.notEnabled.description')}</ThemedText>

            <ThemedView style={styles.benefitsContainer}>
              {benefits.map((benefit, index) => (
                <ThemedView key={index} style={styles.benefitItem}>
                  <ThemedText style={[styles.bulletPoint, { color: successColor }]}>✓</ThemedText>
                  <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>

            <ThemedButton title={i18n.t('screens.security.twoFactor.notEnabled.enableButton')} onPress={handleEnable2FA} style={styles.enableButton} disabled={isLoading} />
          </ThemedView>
        ) : (
          <ThemedView style={styles.section}>
            <ThemedText type="h3" style={[styles.sectionTitle, { color: primaryColor }]}>
              {i18n.t('screens.security.twoFactor.enabled.setup.title')}
            </ThemedText>
            <ThemedText style={styles.description}>{i18n.t('screens.security.twoFactor.enabled.description')}</ThemedText>

            <ThemedView style={styles.setupContainer}>
              <ThemedText style={styles.setupStep}>{i18n.t('screens.security.twoFactor.setup.step1')}</ThemedText>
              <ThemedText style={styles.setupStep}>{i18n.t('screens.security.twoFactor.setup.step2')}</ThemedText>
              <ThemedText style={styles.setupStep}>{i18n.t('screens.security.twoFactor.setup.step3')}</ThemedText>
              <ThemedText style={styles.appsRecommendation}>{i18n.t('screens.security.twoFactor.setup.apps')}</ThemedText>
            </ThemedView>

            {/* Backup Codes Section */}
            <ThemedView
              style={[
                styles.backupCodesContainer,
                {
                  backgroundColor: isBackupCodesLow ? warningColor + '1A' : successColor + '1A',
                  borderColor: isBackupCodesLow ? warningColor + '4D' : successColor + '4D',
                },
              ]}
            >
              <ThemedText style={[styles.backupCodesTitle, { color: isBackupCodesLow ? warningColor : successColor }]}>
                {i18n.t('screens.security.twoFactor.enabled.backupCodes.title')} ({backupCodesCount} remaining)
              </ThemedText>
              {isBackupCodesLow && <ThemedText style={[styles.warningText, { color: warningColor }]}>You&apos;re running low on backup codes. Consider generating new ones.</ThemedText>}
              <View style={styles.backupButtonsContainer}>
                <ThemedButton title="View Codes" variant="secondary" onPress={handleShowBackupCodes} style={styles.backupButton} />
                <ThemedButton title="Generate New" variant="secondary" onPress={handleGenerateNewBackupCodes} style={styles.backupButton} />
              </View>
            </ThemedView>

            <ThemedView style={styles.buttonContainer}>
              <ThemedButton title={i18n.t('screens.security.twoFactor.enabled.disableButton')} variant="link" onPress={handleDisable2FA} style={styles.button} />
            </ThemedView>
          </ThemedView>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    marginRight: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
  benefitText: {
    flex: 1,
    lineHeight: 20,
  },
  enableButton: {
    marginTop: 16,
  },
  setupContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
  },
  setupStep: {
    marginBottom: 12,
    lineHeight: 20,
  },
  appsRecommendation: {
    marginTop: 12,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  backupCodesContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  lowBackupCodes: {
    // Styles applied inline with theme colors
  },
  backupCodesTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  backupButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  backupButton: {
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});
