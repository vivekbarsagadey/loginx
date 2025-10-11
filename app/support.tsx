import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { openMailto } from '@/utils/mailto';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';

export default function SupportScreen() {
  const { push } = useHapticNavigation();
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const platform = Platform.OS;
  const osVersion = Device.osVersion || 'Unknown';

  const faqItems = i18n.t('screens.support.faq.items', { returnObjects: true }) as {
    question: string;
    answer: string;
  }[];

  const handleEmailPress = () => {
    openMailto(i18n.t('screens.support.contact.email'), 'Support Request - LoginX App', 'Please describe your issue below:\n\n');
  };

  const handleNavigateToPrivacy = () => {
    push('/legal/privacy');
  };

  const handleNavigateToTerms = () => {
    push('/legal/terms');
  };

  const handleNavigateToLicense = () => {
    push('/legal/license');
  };

  const handleNavigateToDataRights = () => {
    push('/legal/data-rights');
  };

  const handleNavigateToCookies = () => {
    push('/legal/cookies');
  };

  return (
    <ScreenContainer scrollable>
      {/* Contact Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.support.contact.title')}
        </ThemedText>
        <ThemedText style={styles.contactInfo}>{i18n.t('screens.support.contact.email')}</ThemedText>
        <ThemedText style={styles.contactInfo}>{i18n.t('screens.support.contact.responseTime')}</ThemedText>
        <ThemedText style={styles.contactInfo}>{i18n.t('screens.support.contact.hours')}</ThemedText>
        <ThemedButton
          title={i18n.t('screens.support.contact.emailButton')}
          onPress={handleEmailPress}
          style={styles.emailButton}
          accessibilityLabel="Send support email"
          accessibilityHint="Opens your email client to send a support request"
        />
      </ThemedView>

      {/* FAQ Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.support.faq.title')}
        </ThemedText>
        {faqItems.map((item, index) => (
          <ThemedView key={index} style={styles.faqItem}>
            <Collapsible title={item.question}>
              <ThemedText style={styles.faqAnswer}>{item.answer}</ThemedText>
            </Collapsible>
          </ThemedView>
        ))}
      </ThemedView>

      {/* Resources Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.support.resources.title')}
        </ThemedText>
        <ThemedButton title={i18n.t('screens.support.resources.privacy')} variant="secondary" onPress={handleNavigateToPrivacy} style={styles.resourceButton} />
        <ThemedButton title={i18n.t('screens.support.resources.terms')} variant="secondary" onPress={handleNavigateToTerms} style={styles.resourceButton} />
        <ThemedButton title={i18n.t('screens.support.resources.license')} variant="secondary" onPress={handleNavigateToLicense} style={styles.resourceButton} />
        <ThemedButton title={i18n.t('screens.support.resources.dataRights')} variant="secondary" onPress={handleNavigateToDataRights} style={styles.resourceButton} />
        <ThemedButton title={i18n.t('screens.support.resources.cookies')} variant="secondary" onPress={handleNavigateToCookies} style={styles.resourceButton} />
      </ThemedView>

      {/* Device Info Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.support.deviceInfo.title')}
        </ThemedText>
        <ThemedText style={styles.deviceInfo}>{i18n.t('screens.support.deviceInfo.version', { version: appVersion })}</ThemedText>
        <ThemedText style={styles.deviceInfo}>{i18n.t('screens.support.deviceInfo.platform', { platform: platform })}</ThemedText>
        <ThemedText style={styles.deviceInfo}>{i18n.t('screens.support.deviceInfo.os', { os: osVersion })}</ThemedText>
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  contactInfo: {
    marginBottom: Spacing.sm,
    lineHeight: 22,
    opacity: 0.9,
  },
  emailButton: {
    marginTop: Spacing.md,
  },
  faqItem: {
    marginBottom: Spacing.md,
  },
  faqAnswer: {
    lineHeight: 22,
    opacity: 0.9,
    marginTop: Spacing.sm,
  },
  resourceButton: {
    marginBottom: Spacing.md,
  },
  deviceInfo: {
    marginBottom: 6,
    opacity: 0.8,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
});
