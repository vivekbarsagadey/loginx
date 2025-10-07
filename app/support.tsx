import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Linking, Platform, StyleSheet } from 'react-native';

export default function SupportScreen() {
  const router = useRouter();
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const platform = Platform.OS;
  const osVersion = Device.osVersion || 'Unknown';

  const faqItems = i18n.t('screens.support.faq.items', { returnObjects: true }) as {
    question: string;
    answer: string;
  }[];

  const handleEmailPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const email = i18n.t('screens.support.contact.email');
    const subject = encodeURIComponent('Support Request - LoginX App');
    const body = encodeURIComponent(`App Version: ${appVersion}\nPlatform: ${platform}\nOS Version: ${osVersion}\n\n---\nPlease describe your issue below:\n\n`);
    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error('Email client not available');
      }
    } catch (error) {
      console.error('Error opening email client:', error);
    }
  };

  const handleNavigateToPrivacy = () => {
    router.push('/legal/privacy');
  };

  const handleNavigateToTerms = () => {
    router.push('/legal/terms');
  };

  const handleNavigateToLicense = () => {
    router.push('/legal/license');
  };

  const handleNavigateToDataRights = () => {
    router.push('/legal/data-rights');
  };

  const handleNavigateToCookies = () => {
    router.push('/legal/cookies');
  };

  return (
    <ScreenContainer scrollable>
      <ThemedText type="h1" style={CommonText.title}>
        {i18n.t('screens.support.title')}
      </ThemedText>
      <ThemedText style={CommonText.subtitle}>{i18n.t('screens.support.subtitle')}</ThemedText>

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
