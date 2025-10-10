import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, Typography } from '@/constants/layout';
import i18n from '@/i18n';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet } from 'react-native';

export default function PrivacyScreen() {
  const sections = i18n.t('screens.legal.privacy.sections', { returnObjects: true }) as Record<string, { title: string; content: string }>;

  useEffect(() => {
    // Announce screen to screen readers
    AccessibilityInfo.announceForAccessibility(`${i18n.t('screens.legal.privacy.title')}. Privacy policy document. Scroll to read all sections.`);
  }, []);

  return (
    <ScreenContainer scrollable>
      <ThemedText type="h1" style={styles.title} accessibilityRole="header">
        {i18n.t('screens.legal.privacy.title')}
      </ThemedText>
      <ThemedText style={styles.lastUpdated} accessibilityLabel={`Last updated: ${i18n.t('screens.legal.privacy.lastUpdated')}`}>
        {i18n.t('screens.legal.privacy.lastUpdated')}
      </ThemedText>

      {Object.entries(sections).map(([key, section], index) => (
        <ThemedView key={key} style={styles.section} accessible={true} accessibilityLabel={`Section ${index + 1}: ${section.title}`}>
          <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
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
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },
  sectionContent: {
    lineHeight: Typography.body.lineHeight,
    opacity: 0.9,
  },
});
