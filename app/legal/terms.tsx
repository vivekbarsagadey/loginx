import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, StyleSheet } from 'react-native';
import i18n from '@/i18n';

export default function TermsScreen() {
  const sections = i18n.t('screens.legal.terms.sections', { returnObjects: true }) as Record<string, { title: string; content: string }>;

  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={styles.container}>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('screens.legal.terms.title')}
        </ThemedText>
        <ThemedText style={styles.lastUpdated}>{i18n.t('screens.legal.terms.lastUpdated')}</ThemedText>

        {Object.entries(sections).map(([key, section]) => (
          <ThemedView key={key} style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              {section.title}
            </ThemedText>
            <ThemedText style={styles.sectionContent}>{section.content}</ThemedText>
          </ThemedView>
        ))}
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
  lastUpdated: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  sectionContent: {
    lineHeight: 22,
    opacity: 0.9,
  },
});
