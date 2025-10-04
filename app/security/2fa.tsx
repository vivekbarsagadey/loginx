import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { ActivityIndicator, Alert, StyleSheet, Switch, View } from 'react-native';

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
      <ScreenContainer centerContent>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading security settings...</ThemedText>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer centerContent>
        <ThemedText style={[styles.errorText, { color: errorColor }]}>Error: {error}</ThemedText>
        <ThemedButton title="Retry" onPress={() => window.location.reload()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
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
  loadingText: {
    marginTop: Spacing.md,
    opacity: 0.7,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: Spacing.lg,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  benefitsContainer: {
    marginBottom: Spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    marginRight: Spacing.md,
    fontWeight: 'bold',
    fontSize: 16,
  },
  benefitText: {
    flex: 1,
    lineHeight: 20,
  },
  enableButton: {
    marginTop: Spacing.md,
  },
  setupContainer: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  setupStep: {
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  appsRecommendation: {
    marginTop: Spacing.md,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  backupCodesContainer: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  lowBackupCodes: {
    // Styles applied inline with theme colors
  },
  backupCodesTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  warningText: {
    fontSize: 14,
    marginBottom: Spacing.md,
    fontStyle: 'italic',
  },
  backupButtonsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  backupButton: {
    flex: 1,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  button: {
    marginBottom: Spacing.sm,
  },
});
