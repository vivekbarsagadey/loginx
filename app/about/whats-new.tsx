import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/i18n';
import { StyleSheet } from 'react-native';

export default function WhatsNewScreen() {
  const features = i18n.t('screens.whatsNew.features', { returnObjects: true }) as { title: string; description: string }[];
  const bugFixes = i18n.t('screens.whatsNew.bugFixesList', { returnObjects: true }) as string[];

  return (
    <ScreenContainer scrollable>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.whatsNew.title')}
      </ThemedText>
      <ThemedText type="h2" style={styles.version}>
        {i18n.t('screens.whatsNew.version')}
      </ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle}>
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
        <ThemedText type="h3" style={styles.sectionTitle}>
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
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  featureItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    // Background handled by theme
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDescription: {
    opacity: 0.8,
    lineHeight: 20,
  },
  bugFixItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  bulletPoint: {
    marginRight: 8,
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
