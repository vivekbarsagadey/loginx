import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { getShadow } from '@/constants/style-utils';
import { useOnboarding } from '@/hooks/use-onboarding-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface CompletionSlideProps {
  width: number;
  onComplete?: () => void;
}

export const CompletionSlide = ({ width, onComplete }: CompletionSlideProps) => {
  const successColor = useThemeColor({}, 'success');
  const backgroundColor = useThemeColor({}, 'bg');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const shadowColor = useThemeColor({}, 'text');
  const { permissions, analytics } = useOnboarding();

  const completedFeatures = [
    {
      key: 'account',
      title: i18n.t('onb.completion.features.account'),
      completed: true,
      icon: 'person-circle' as const,
    },
    {
      key: 'security',
      title: i18n.t('onb.completion.features.security'),
      completed: permissions.biometric.requested,
      icon: 'shield-checkmark' as const,
    },
    {
      key: 'preferences',
      title: i18n.t('onb.completion.features.preferences'),
      completed: analytics.slidesCompleted.includes('personalize'),
      icon: 'settings' as const,
    },
    {
      key: 'notifications',
      title: i18n.t('onb.completion.features.notifications'),
      completed: permissions.notifications.requested,
      icon: 'notifications' as const,
    },
  ];

  return (
    <ThemedView style={[styles.container, { width }]}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedView style={[styles.iconCircle, { backgroundColor: successColor, shadowColor }, getShadow('md')]}>
            <Ionicons name="checkmark-circle" size={64} color={backgroundColor} />
          </ThemedView>

          <ThemedText type="h1" style={styles.title}>
            {i18n.t('onb.completion.title')}
          </ThemedText>

          <ThemedText type="body" style={styles.subtitle}>
            {i18n.t('onb.completion.subtitle', { app: 'LoginX' })}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.summarySection}>
          <ThemedText type="h2" style={styles.summaryTitle}>
            {i18n.t('onb.completion.summary')}
          </ThemedText>

          {completedFeatures.map((feature) => (
            <ThemedView key={feature.key} style={styles.featureItem}>
              <ThemedView style={[styles.featureIcon, { backgroundColor: feature.completed ? `${successColor}20` : `${textMutedColor}20` }]}>
                <Ionicons name={feature.icon} size={20} color={feature.completed ? successColor : textMutedColor} />
              </ThemedView>
              <ThemedText type="body" style={[styles.featureTitle, { opacity: feature.completed ? 1 : 0.6 }]}>
                {feature.title}
              </ThemedText>
              <Ionicons name={feature.completed ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={feature.completed ? successColor : textMutedColor} />
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedButton title={i18n.t('onb.completion.start', { app: 'LoginX' })} onPress={onComplete} style={styles.completeButton} />

          <ThemedText type="caption" style={styles.footerText}>
            {i18n.t('onb.completion.footerText')}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 600,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    // Shadow added dynamically via getShadow()
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
    fontWeight: Typography.h1.fontWeight,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
    opacity: 0.8,
  },
  summarySection: {
    flex: 1,
    marginTop: 40,
  },
  summaryTitle: {
    marginBottom: Spacing.lg,
    fontWeight: Typography.h2.fontWeight,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTitle: {
    flex: 1,
    fontWeight: Typography.bodyBold.fontWeight,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.lg,
  },
  completeButton: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  footerText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
