import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet } from 'react-native';

export default function TermsScreen() {
  const sections = i18n.t('screens.legal.terms.sections', { returnObjects: true }) as Record<string, { title: string; content: string }>;

  return (
    <ScreenContainer scrollable>
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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  lastUpdated: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: 'bold',
  },
  sectionContent: {
    lineHeight: 22,
    opacity: 0.9,
  },
});
