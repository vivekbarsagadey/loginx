import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing, Typography } from '@/constants/layout';
import i18n from '@/i18n';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet } from 'react-native';

export default function TermsScreen() {
  const sections = i18n.t('screens.legal.terms.sections', { returnObjects: true }) as Record<string, { title: string; content: string }>;

  useEffect(() => {
    // Announce screen to screen readers
    AccessibilityInfo.announceForAccessibility(`${i18n.t('screens.legal.terms.title')}. Legal document. Scroll to read all sections.`);
  }, []);

  return (
    <ScreenContainer scrollable>
      <ThemedText style={styles.lastUpdated} accessibilityLabel={`Last updated: ${i18n.t('screens.legal.terms.lastUpdated')}`}>
        {i18n.t('screens.legal.terms.lastUpdated')}
      </ThemedText>

      {Object.entries(sections).map(([key, section], index) => (
        <ThemedView key={key} style={styles.section} accessible={true} accessibilityLabel={`Section ${index + 1}: ${section.title}`}>
          <ThemedText type="h3" style={CommonText.sectionTitle} accessibilityRole="header">
            {section.title}
          </ThemedText>
          <ThemedText style={styles.sectionContent}>{section.content}</ThemedText>
        </ThemedView>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lastUpdated: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionContent: {
    lineHeight: Typography.body.lineHeight,
    opacity: 0.9,
  },
});
