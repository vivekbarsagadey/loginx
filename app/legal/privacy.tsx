import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing, Typography } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet } from 'react-native';

export default function PrivacyScreen() {
  const sections = i18n.t('screens.legal.privacy.sections', { returnObjects: true }) as Record<string, { title: string; content: string }>;

  return (
    <ScreenContainer scrollable>
      <ThemedText type="h1" style={CommonText.title}>
        {i18n.t('screens.legal.privacy.title')}
      </ThemedText>
      <ThemedText style={styles.lastUpdated}>{i18n.t('screens.legal.privacy.lastUpdated')}</ThemedText>

      {Object.entries(sections).map(([key, section]) => (
        <ThemedView key={key} style={styles.section}>
          <ThemedText type="h3" style={CommonText.sectionTitle}>
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
