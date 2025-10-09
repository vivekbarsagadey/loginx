import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet } from 'react-native';

export default function WhatsNewScreen() {
  const features = i18n.t('screens.whatsNew.features', { returnObjects: true }) as { title: string; description: string }[];
  const bugFixes = i18n.t('screens.whatsNew.bugFixesList', { returnObjects: true }) as string[];

  return (
    <ScreenContainer scrollable>
      <ThemedText type="h2" style={styles.version}>
        {i18n.t('screens.whatsNew.version')}
      </ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          ✨ New Features
        </ThemedText>
        {features.map((feature, index) => (
          <ThemedView key={index} style={styles.featureItem}>
            <ThemedText type="body" style={styles.featureTitle}>
              {feature.title}
            </ThemedText>
            <ThemedText style={styles.featureDescription}>{feature.description}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          🐛 {i18n.t('screens.whatsNew.bugFixes')}
        </ThemedText>
        {bugFixes.map((fix, index) => (
          <ThemedView key={index} style={styles.bugFixItem}>
            <ThemedText style={styles.bulletPoint}>•</ThemedText>
            <ThemedText style={styles.bugFixText}>{fix}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.thankYou}>{i18n.t('screens.whatsNew.thankYou')}</ThemedText>
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  version: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.7,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  featureItem: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    // Background handled by theme
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  featureDescription: {
    opacity: 0.8,
    lineHeight: 20,
  },
  bugFixItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  bulletPoint: {
    marginRight: Spacing.sm,
    fontWeight: 'bold',
  },
  bugFixText: {
    flex: 1,
    lineHeight: 20,
  },
  thankYou: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
    lineHeight: 22,
  },
});
