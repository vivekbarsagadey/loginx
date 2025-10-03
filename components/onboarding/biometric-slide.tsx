import { Colors } from '@/constants/theme';
import { useBiometricAuth } from '@/hooks/use-biometric-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOnboarding } from '@/hooks/use-onboarding-provider';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface BiometricSlideProps {
  width: number;
  onNext?: () => void;
  onSkip?: () => void;
}

export const BiometricSlide = ({ width, onNext, onSkip }: BiometricSlideProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];
  const { setBiometricPermission, trackSlideCompletion } = useOnboarding();
  const { isAvailable, biometryType, isEnabled, isLoading, error, enableBiometric, biometricTypeName, checkBiometricSupport } = useBiometricAuth();

  const [setupAttempted, setSetupAttempted] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, [checkBiometricSupport]);

  const handleEnableBiometric = useCallback(async () => {
    setSetupAttempted(true);
    try {
      const success = await enableBiometric();
      if (success) {
        // Track permission grant and slide completion
        await setBiometricPermission(true, biometryType || undefined);
        await trackSlideCompletion('biometric');

        // Show success feedback
        Alert.alert(i18n.t('onb.biometric.success.title'), i18n.t('onb.biometric.success.message', { biometricType: biometricTypeName }), [{ text: i18n.t('onb.cta.next'), onPress: onNext }]);
      } else {
        // Handle setup failure
        Alert.alert(i18n.t('onb.biometric.error.title'), error || i18n.t('onb.biometric.error.message'), [
          { text: i18n.t('onb.biometric.tryAgain'), onPress: () => setSetupAttempted(false) },
          { text: i18n.t('onb.biometric.skipButton'), onPress: onSkip, style: 'cancel' },
        ]);
      }
    } catch (_err) {
      Alert.alert(i18n.t('onb.biometric.error.title'), i18n.t('onb.biometric.error.unexpected'), [{ text: i18n.t('common.ok'), onPress: () => setSetupAttempted(false) }]);
    }
  }, [enableBiometric, biometricTypeName, error, onNext, onSkip, biometryType, setBiometricPermission, trackSlideCompletion]);

  const handleSkip = useCallback(() => {
    Alert.alert(i18n.t('onb.biometric.skipConfirm.title'), i18n.t('onb.biometric.skipConfirm.message'), [
      { text: i18n.t('onb.biometric.skipConfirm.cancel'), style: 'cancel' },
      { text: i18n.t('onb.biometric.skipConfirm.skip'), onPress: onSkip, style: 'destructive' },
    ]);
  }, [onSkip]);

  const getBiometricIcon = () => {
    switch (biometryType) {
      case 'FaceID':
        return 'ios-face-id';
      case 'TouchID':
        return 'ios-finger-print';
      case 'Biometrics':
        return 'ios-finger-print';
      default:
        return 'ios-lock-closed';
    }
  };

  const getBiometricDescription = () => {
    if (!isAvailable) {
      return i18n.t('onb.biometric.notSupported');
    }

    switch (biometryType) {
      case 'FaceID':
        return i18n.t('onb.biometric.faceId');
      case 'TouchID':
        return i18n.t('onb.biometric.touchId');
      case 'Biometrics':
        return i18n.t('onb.biometric.fingerprint');
      default:
        return i18n.t('onb.biometric.generic');
    }
  };

  return (
    <ThemedView style={[styles.container, { width }]}>
      <ThemedView style={styles.iconContainer}>
        <ThemedView style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
          <Ionicons name={getBiometricIcon() as keyof typeof Ionicons.glyphMap} size={64} color={theme.background} />
        </ThemedView>
      </ThemedView>

      <ThemedText type="h1" style={styles.title}>
        {i18n.t('onb.biometric.title')}
      </ThemedText>

      <ThemedText type="body" style={styles.description}>
        {getBiometricDescription()}
      </ThemedText>

      {isAvailable && (
        <ThemedView style={styles.benefitsContainer}>
          <ThemedText type="h3" style={styles.benefitsTitle}>
            {i18n.t('onb.biometric.benefits.title')}
          </ThemedText>
          {(i18n.t('onb.biometric.benefits.items', { returnObjects: true }) as string[]).map((benefit, index) => (
            <ThemedView key={index} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
              <ThemedText type="body" style={styles.benefitText}>
                {benefit}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.buttonContainer}>
        {isAvailable && !isEnabled ? (
          <ThemedButton
            title={i18n.t('onb.biometric.enable', { biometricType: biometricTypeName })}
            onPress={handleEnableBiometric}
            disabled={isLoading || setupAttempted}
            loading={isLoading}
            style={styles.primaryButton}
          />
        ) : isEnabled ? (
          <ThemedButton title={i18n.t('onb.cta.next')} onPress={onNext} style={styles.primaryButton} />
        ) : (
          <ThemedButton title={i18n.t('onb.biometric.notAvailable')} onPress={onNext} style={styles.primaryButton} />
        )}

        <ThemedButton title={i18n.t('onb.biometric.skipButton')} onPress={handleSkip} variant="secondary" style={styles.secondaryButton} />
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText type="caption" style={[styles.errorText, { color: theme.error }]}>
            {error}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  description: {
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  benefitsTitle: {
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  benefitText: {
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  errorContainer: {
    marginTop: 16,
    width: '100%',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
  },
});
