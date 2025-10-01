import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/themed-button';
import { ScrollView, StyleSheet } from 'react-native';
import i18n from '@/i18n';
import { useState } from 'react';

export default function TwoFactorAuthScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const benefits = i18n.t('screens.security.twoFactor.notEnabled.benefits', { returnObjects: true }) as string[];

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('screens.security.twoFactor.title')}
        </ThemedText>
        <ThemedText style={styles.subtitle}>{i18n.t('screens.security.twoFactor.subtitle')}</ThemedText>

        {!isEnabled ? (
          <ThemedView style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              {i18n.t('screens.security.twoFactor.notEnabled.title')}
            </ThemedText>
            <ThemedText style={styles.description}>{i18n.t('screens.security.twoFactor.notEnabled.description')}</ThemedText>

            <ThemedView style={styles.benefitsContainer}>
              {benefits.map((benefit, index) => (
                <ThemedView key={index} style={styles.benefitItem}>
                  <ThemedText style={styles.bulletPoint}>✓</ThemedText>
                  <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>

            <ThemedButton title={i18n.t('screens.security.twoFactor.notEnabled.enableButton')} onPress={() => setIsEnabled(true)} style={styles.enableButton} />
          </ThemedView>
        ) : (
          <ThemedView style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              {i18n.t('screens.security.twoFactor.enabled.title')}
            </ThemedText>
            <ThemedText style={styles.description}>{i18n.t('screens.security.twoFactor.enabled.description')}</ThemedText>

            <ThemedView style={styles.setupContainer}>
              <ThemedText style={styles.setupStep}>{i18n.t('screens.security.twoFactor.setup.step1')}</ThemedText>
              <ThemedText style={styles.setupStep}>{i18n.t('screens.security.twoFactor.setup.step2')}</ThemedText>
              <ThemedText style={styles.setupStep}>{i18n.t('screens.security.twoFactor.setup.step3')}</ThemedText>
              <ThemedText style={styles.appsRecommendation}>{i18n.t('screens.security.twoFactor.setup.apps')}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.buttonContainer}>
              <ThemedButton title={i18n.t('screens.security.twoFactor.enabled.backupCodes')} variant="secondary" style={styles.button} />
              <ThemedButton title={i18n.t('screens.security.twoFactor.enabled.disableButton')} variant="link" onPress={() => setIsEnabled(false)} style={styles.button} />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  description: {
    lineHeight: 22,
    opacity: 0.9,
    marginBottom: 20,
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
    color: '#34C759',
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
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
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
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginBottom: 8,
  },
});
