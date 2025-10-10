import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import i18n from '@/i18n';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet } from 'react-native';

export default function LicenseScreen() {
  const libraries = i18n.t('screens.legal.license.openSource.libraries', { returnObjects: true }) as { name: string; license: string; description: string }[];

  useEffect(() => {
    // Announce screen to screen readers
    AccessibilityInfo.announceForAccessibility(`${i18n.t('screens.legal.license.title')}. Software license information. Scroll to read all sections.`);
  }, []);

  return (
    <ScreenContainer scrollable>
      <ThemedView style={styles.section} accessible={true} accessibilityLabel="Application License">
        <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.license.appLicense.title')}
        </ThemedText>
        <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.license.appLicense.content')}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section} accessible={true} accessibilityLabel="Open Source Libraries">
        <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.license.openSource.title')}
        </ThemedText>
        <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.license.openSource.intro')}</ThemedText>

        {libraries.map((library, index) => (
          <ThemedView key={index} style={styles.libraryItem} accessible={true} accessibilityLabel={`Library ${index + 1}: ${library.name}, ${library.license}`} accessibilityHint={library.description}>
            <ThemedText type="body" style={styles.libraryName}>
              {library.name}
            </ThemedText>
            <ThemedText style={styles.libraryLicense}>{library.license}</ThemedText>
            <ThemedText style={styles.libraryDescription}>{library.description}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.section} accessible={true} accessibilityLabel="Copyright Information">
        <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.license.copyright.title')}
        </ThemedText>
        <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.license.copyright.content')}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section} accessible={true} accessibilityLabel="Attribution Requirements">
        <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.license.attribution.title')}
        </ThemedText>
        <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.license.attribution.content')}</ThemedText>
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.bodyBold.fontWeight,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionContent: {
    lineHeight: Typography.body.lineHeight,
    opacity: 0.9,
    marginBottom: Spacing.md,
  },
  libraryItem: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    // Background handled by theme
  },
  libraryName: {
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.xs,
  },
  libraryLicense: {
    opacity: 0.7,
    marginBottom: Spacing.xs,
    fontStyle: 'italic',
  },
  libraryDescription: {
    opacity: 0.8,
    lineHeight: Typography.caption.lineHeight,
  },
});
