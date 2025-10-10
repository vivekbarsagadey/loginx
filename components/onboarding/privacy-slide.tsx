import { BorderRadius } from '@/constants/layout';
import { gap, rounded } from '@/constants/style-utils';
import { useOnboarding } from '@/hooks/use-onboarding-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet } from 'react-native';
import { ExternalLink } from '../external-link';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface PrivacySlideProps {
  width: number;
  onNext?: () => void;
}

export const PrivacySlide = ({ width, onNext }: PrivacySlideProps) => {
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'bg');
  const successColor = useThemeColor({}, 'success');
  const borderColor = useThemeColor({}, 'border');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const { trackSlideCompletion } = useOnboarding();

  const handleNext = async () => {
    await trackSlideCompletion('privacy');
    onNext?.();
  };

  const securityFeatures = [
    {
      icon: 'shield-checkmark' as const,
      title: i18n.t('onb.privacy.features.encryption.title'),
      description: i18n.t('onb.privacy.features.encryption.description'),
    },
    {
      icon: 'phone-portrait' as const,
      title: i18n.t('onb.privacy.features.localStorage.title'),
      description: i18n.t('onb.privacy.features.localStorage.description'),
    },
    {
      icon: 'cloud-outline' as const,
      title: i18n.t('onb.privacy.features.cloudStorage.title'),
      description: i18n.t('onb.privacy.features.cloudStorage.description'),
    },
    {
      icon: 'finger-print' as const,
      title: i18n.t('onb.privacy.features.biometrics.title'),
      description: i18n.t('onb.privacy.features.biometrics.description'),
    },
  ];

  const complianceFeatures = [
    {
      icon: 'document-text' as const,
      title: i18n.t('onb.privacy.compliance.gdpr.title'),
      description: i18n.t('onb.privacy.compliance.gdpr.description'),
    },
    {
      icon: 'eye-off' as const,
      title: i18n.t('onb.privacy.compliance.noTracking.title'),
      description: i18n.t('onb.privacy.compliance.noTracking.description'),
    },
    {
      icon: 'trash' as const,
      title: i18n.t('onb.privacy.compliance.dataControl.title'),
      description: i18n.t('onb.privacy.compliance.dataControl.description'),
    },
  ];

  return (
    <ThemedView style={[styles.container, { width }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
        <ThemedView style={styles.header}>
          <ThemedView style={[styles.iconCircle, { backgroundColor: primaryColor }]}>
            <Ionicons name="lock-closed" size={64} color={backgroundColor} />
          </ThemedView>

          <ThemedText type="h1" style={styles.title}>
            {i18n.t('onb.privacy.title')}
          </ThemedText>

          <ThemedText type="body" style={styles.description}>
            {i18n.t('onb.privacy.description')}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            {i18n.t('onb.privacy.security.title')}
          </ThemedText>

          {securityFeatures.map((feature, index) => (
            <ThemedView key={index} style={styles.featureItem}>
              <ThemedView style={[styles.featureIcon, { backgroundColor: `${primaryColor}20` }]}>
                <Ionicons name={feature.icon} size={24} color={primaryColor} />
              </ThemedView>
              <ThemedView style={styles.featureContent}>
                <ThemedText type="h3" style={styles.featureTitle}>
                  {feature.title}
                </ThemedText>
                <ThemedText type="body" style={styles.featureDescription}>
                  {feature.description}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="h2" style={styles.sectionTitle}>
            {i18n.t('onb.privacy.compliance.title')}
          </ThemedText>

          {complianceFeatures.map((feature, index) => (
            <ThemedView key={index} style={styles.featureItem}>
              <ThemedView style={[styles.featureIcon, { backgroundColor: `${successColor}20` }]}>
                <Ionicons name={feature.icon} size={24} color={successColor} />
              </ThemedView>
              <ThemedView style={styles.featureContent}>
                <ThemedText type="h3" style={styles.featureTitle}>
                  {feature.title}
                </ThemedText>
                <ThemedText type="body" style={styles.featureDescription}>
                  {feature.description}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.linksSection}>
          <ThemedText type="h3" style={styles.linksSectionTitle}>
            {i18n.t('onb.privacy.links.title')}
          </ThemedText>

          <ThemedView style={styles.linksContainer}>
            <ExternalLink href="/legal/privacy" style={[styles.link, { borderColor: borderColor }]}>
              <Ionicons name="document-text" size={20} color={primaryColor} />
              <ThemedText type="body" style={[styles.linkText, { color: primaryColor }]}>
                {i18n.t('onb.privacy.links.privacyPolicy')}
              </ThemedText>
              <Ionicons name="chevron-forward" size={16} color={textMutedColor} />
            </ExternalLink>

            <ExternalLink href="/security/sessions" style={[styles.link, { borderColor: borderColor }]}>
              <Ionicons name="shield-checkmark" size={20} color={primaryColor} />
              <ThemedText type="body" style={[styles.linkText, { color: primaryColor }]}>
                {i18n.t('onb.privacy.links.securityDetails')}
              </ThemedText>
              <Ionicons name="chevron-forward" size={16} color={textMutedColor} />
            </ExternalLink>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <ThemedView style={styles.footer}>
        <ThemedView style={styles.trustBadge}>
          <Ionicons name="checkmark-circle" size={20} color={successColor} />
          <ThemedText type="caption" style={[styles.trustText, { color: successColor }]}>
            {i18n.t('onb.privacy.trustBadge')}
          </ThemedText>
        </ThemedView>

        <ThemedButton title={i18n.t('onb.cta.next')} onPress={handleNext} style={styles.nextButton} />
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
    maxWidth: 600,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    // Shadow color handled by platform defaults
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
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
    width: '100%',
    maxWidth: 600,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 48,
    height: 48,
    ...rounded.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    marginBottom: 4,
    fontWeight: '600',
  },
  featureDescription: {
    lineHeight: 20,
    opacity: 0.8,
  },
  linksSection: {
    marginBottom: 24,
    width: '100%',
    maxWidth: 600,
  },
  linksSectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  linksContainer: {
    ...gap.md,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  linkText: {
    flex: 1,
    marginLeft: 12,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    // Background color handled by theme
  },
  trustText: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  nextButton: {
    width: '100%',
  },
});
