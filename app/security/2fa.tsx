import { ScreenContainer } from '@/components/screen-container';
import { ReAuthPrompt } from '@/components/security/re-auth-prompt'; // TASK-076: Import re-auth prompt
import { ThemedButton } from '@/components/themed-button';
import { ThemedLoadingSpinner } from '@/components/themed-loading-spinner';
import { HStack } from '@/components/themed-stack';
import { ThemedSurface } from '@/components/themed-surface';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SuccessAnimation } from '@/components/ui/success-animation';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, FontWeight, Spacing, Typography } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useAlert } from '@/hooks/use-alert';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { useState } from 'react'; // TASK-076: Import useState
import { StyleSheet, Switch, View } from 'react-native';

export default function TwoFactorAuthScreen() {
  const alert = useAlert();
  const user = auth.currentUser; // TASK-076: Get current user
  const { isEnabled, backupCodes, isLoading, error, enableTwoFactor, disableTwoFactor, generateBackupCodes, backupCodesCount, isBackupCodesLow, formatBackupCode } = useTwoFactorAuth();

  const { isAvailable: biometricAvailable, isEnabled: biometricEnabled, biometricTypeName, enableBiometric, disableBiometric, isLoading: biometricLoading } = useBiometricAuth();

  // TASK-076: Re-authentication state
  const [showReAuthForTwoFactor, setShowReAuthForTwoFactor] = useState(false);
  const [pendingTwoFactorAction, setPendingTwoFactorAction] = useState<'enable' | 'disable' | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successAnimationConfig, setSuccessAnimationConfig] = useState<{
    title: string;
    message: string;
    icon: 'shield-checkmark' | 'shield';
  }>({
    title: '',
    message: '',
    icon: 'shield-checkmark',
  });

  const errorColor = useThemeColor({}, 'error');
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');

  const benefits = i18n.t('screens.security.twoFactor.notEnabled.benefits', { returnObjects: true }) as string[];

  const handleEnable2FA = async () => {
    // TASK-076: Trigger re-authentication before enabling 2FA
    setPendingTwoFactorAction('enable');
    setShowReAuthForTwoFactor(true);
  };

  const handleDisable2FA = async () => {
    alert.show(i18n.t('screens.security.twoFactor.alerts.disable.title'), i18n.t('screens.security.twoFactor.alerts.disable.message'), [
      { text: i18n.t('screens.security.twoFactor.alerts.disable.cancel'), style: 'cancel' },
      {
        text: i18n.t('screens.security.twoFactor.alerts.disable.confirm'),
        style: 'destructive',
        onPress: async () => {
          // TASK-076: Trigger re-authentication before disabling 2FA
          setPendingTwoFactorAction('disable');
          setShowReAuthForTwoFactor(true);
        },
      },
    ]);
  };

  // TASK-076: Proceed with 2FA action after successful re-authentication
  const handleReAuthSuccessForTwoFactor = async () => {
    setShowReAuthForTwoFactor(false);

    try {
      if (pendingTwoFactorAction === 'enable') {
        const success = await enableTwoFactor();
        if (success) {
          setSuccessAnimationConfig({
            title: i18n.t('screens.security.twoFactor.success.enabled.title'),
            message: i18n.t('screens.security.twoFactor.success.enabled.message'),
            icon: 'shield-checkmark',
          });
          setShowSuccessAnimation(true);
        }
      } else if (pendingTwoFactorAction === 'disable') {
        await disableTwoFactor();
        setSuccessAnimationConfig({
          title: i18n.t('screens.security.twoFactor.success.disabled.title'),
          message: i18n.t('screens.security.twoFactor.success.disabled.message'),
          icon: 'shield',
        });
        setShowSuccessAnimation(true);
      }
    } catch (_err) {
      showError(_error);
    } finally {
      setPendingTwoFactorAction(null);
    }
  };

  // TASK-076: Handle re-auth cancellation
  const handleReAuthCancelForTwoFactor = () => {
    setShowReAuthForTwoFactor(false);
    setPendingTwoFactorAction(null);
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
          } catch (_err) {
            showError(_error);
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
    } catch (_err) {
      showError(_error);
    }
  };

  if (isLoading) {
    return (
      <>
        <ScreenContainer>
          <ThemedLoadingSpinner size="large" text={i18n.t('screens.security.twoFactor.loading')} />
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
            <ThemedSurface elevation={1} style={styles.switchContainer}>
              <ThemedText>{i18n.t('screens.security.twoFactor.biometric.enableLabel', { type: biometricTypeName })}</ThemedText>
              <Switch value={biometricEnabled} onValueChange={handleToggleBiometric} disabled={biometricLoading} />
            </ThemedSurface>
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
                <HStack key={index} spacing="md" align="flex-start" style={styles.benefitItem}>
                  <ThemedText style={[styles.bulletPoint, { color: successColor }]}>✓</ThemedText>
                  <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
                </HStack>
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

      {/* TASK-076: Re-authentication prompt for 2FA changes */}
      <ReAuthPrompt
        visible={showReAuthForTwoFactor}
        onSuccess={handleReAuthSuccessForTwoFactor}
        onCancel={handleReAuthCancelForTwoFactor}
        reason={i18n.t('screens.security.twoFactor.reauth.reason')}
        allowPasswordFallback={true}
        userEmail={user?.email || undefined}
        checkSessionTimeout={true}
      />

      {/* Success animation for 2FA enable/disable */}
      <SuccessAnimation
        visible={showSuccessAnimation}
        title={successAnimationConfig.title}
        message={successAnimationConfig.message}
        icon={successAnimationConfig.icon}
        showConfetti={pendingTwoFactorAction === 'enable'}
        duration={3000}
        onComplete={() => {
          setShowSuccessAnimation(false);
        }}
      />
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
    lineHeight: Typography.body.lineHeight,
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
    fontWeight: FontWeight.bold,
    fontSize: Typography.body.fontSize,
  },
  benefitText: {
    flex: 1,
    lineHeight: Typography.bodySmall.lineHeight,
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
    lineHeight: Typography.bodySmall.lineHeight,
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
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  warningText: {
    fontSize: Typography.bodySmall.fontSize,
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
