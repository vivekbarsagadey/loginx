import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';

export default function TwoFactorAuthScreen() {
  const alert = useAlert();
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
        showSuccess(i18n.t('screens.security.twoFactor.success.enabled.title'), i18n.t('screens.security.twoFactor.success.enabled.message'));
      }
    } catch (err) {
      showError(err);
    }
  };

  const handleDisable2FA = async () => {
    alert.show(i18n.t('screens.security.twoFactor.alerts.disable.title'), i18n.t('screens.security.twoFactor.alerts.disable.message'), [
      { text: i18n.t('screens.security.twoFactor.alerts.disable.cancel'), style: 'cancel' },
      {
        text: i18n.t('screens.security.twoFactor.alerts.disable.confirm'),
        style: 'destructive',
        onPress: async () => {
          try {
            await disableTwoFactor();
            showSuccess(i18n.t('screens.security.twoFactor.success.disabled.title'), i18n.t('screens.security.twoFactor.success.disabled.message'));
          } catch (err) {
            showError(err);
          }
        },
      },
    ]);
  };

  const handleShowBackupCodes = () => {
    const formattedCodes = backupCodes.map((code) => formatBackupCode(code)).join('\n');
    alert.show(i18n.t('screens.security.twoFactor.alerts.backupCodes.title', { count: backupCodesCount }), i18n.t('screens.security.twoFactor.alerts.backupCodes.message', { codes: formattedCodes }), [
      { text: i18n.t('common.ok') },
    ]);
  };

  const handleGenerateNewBackupCodes = async () => {
    alert.show(i18n.t('screens.security.twoFactor.alerts.generateCodes.title'), i18n.t('screens.security.twoFactor.alerts.generateCodes.message'), [
      { text: i18n.t('screens.security.twoFactor.alerts.generateCodes.cancel'), style: 'cancel' },
      {
        text: i18n.t('screens.security.twoFactor.alerts.generateCodes.confirm'),
        onPress: async () => {
          try {
            await generateBackupCodes();
            showSuccess(i18n.t('screens.security.twoFactor.success.codesGenerated.title'), i18n.t('screens.security.twoFactor.success.codesGenerated.message'));
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
          showSuccess(i18n.t('screens.security.twoFactor.success.biometricEnabled.title'), i18n.t('screens.security.twoFactor.success.biometricEnabled.message', { type: biometricTypeName }));
        }
      } else {
        await disableBiometric();
        showSuccess(i18n.t('screens.security.twoFactor.success.biometricDisabled.title'), i18n.t('screens.security.twoFactor.success.biometricDisabled.message', { type: biometricTypeName }));
      }
    } catch (err) {
      showError(err);
    }
  };

  if (isLoading) {
    return (
      <>
        <ScreenContainer>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>{i18n.t('screens.security.twoFactor.loading')}</ThemedText>
        </ScreenContainer>
        {alert.AlertComponent}
      </>
    );
  }

  if (error) {
    return (
      <>
        <ScreenContainer>
          <ThemedText style={[styles.errorText, { color: errorColor }]}>
            {i18n.t('screens.security.twoFactor.error.prefix')}
            {error}
          </ThemedText>
          <ThemedButton title={i18n.t('screens.security.twoFactor.error.retryButton')} onPress={() => window.location.reload()} />
        </ScreenContainer>
        {alert.AlertComponent}
      </>
    );
  }

  return (
    <>
      <ScreenContainer scrollable useSafeArea={false}>
        <ThemedText style={CommonText.subtitle}>{i18n.t('screens.security.twoFactor.subtitle')}</ThemedText>

        {/* Biometric Authentication Section */}
        {biometricAvailable && (
          <ThemedView style={styles.section}>
            <ThemedText type="h3" style={[CommonText.sectionTitle, { color: primaryColor }]}>
              {i18n.t('screens.security.twoFactor.biometric.title', { type: biometricTypeName })}
            </ThemedText>
            <ThemedText style={styles.description}>{i18n.t('screens.security.twoFactor.biometric.description', { type: biometricTypeName.toLowerCase() })}</ThemedText>
            <View style={[styles.switchContainer, { backgroundColor: surfaceVariant }]}>
              <ThemedText>{i18n.t('screens.security.twoFactor.biometric.enableLabel', { type: biometricTypeName })}</ThemedText>
              <Switch value={biometricEnabled} onValueChange={handleToggleBiometric} disabled={biometricLoading} />
            </View>
          </ThemedView>
        )}

        {/* 2FA Section */}
        {!isEnabled ? (
          <ThemedView style={styles.section}>
            <ThemedText type="h3" style={[CommonText.sectionTitle, { color: primaryColor }]}>
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
            <ThemedText type="h3" style={[CommonText.sectionTitle, { color: primaryColor }]}>
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
              {isBackupCodesLow && <ThemedText style={[styles.warningText, { color: warningColor }]}>{i18n.t('screens.security.twoFactor.enabled.backupCodes.warningLow')}</ThemedText>}
              <View style={styles.backupButtonsContainer}>
                <ThemedButton title={i18n.t('screens.security.twoFactor.enabled.backupCodes.viewButton')} variant="secondary" onPress={handleShowBackupCodes} style={styles.backupButton} />
                <ThemedButton title={i18n.t('screens.security.twoFactor.enabled.backupCodes.generateButton')} variant="secondary" onPress={handleGenerateNewBackupCodes} style={styles.backupButton} />
              </View>
            </ThemedView>

            <ThemedView style={styles.buttonContainer}>
              <ThemedButton title={i18n.t('screens.security.twoFactor.enabled.disableButton')} variant="link" onPress={handleDisable2FA} style={styles.button} />
            </ThemedView>
          </ThemedView>
        )}
      </ScreenContainer>
      {alert.AlertComponent}
    </>
  );
}

const styles = StyleSheet.create({
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
