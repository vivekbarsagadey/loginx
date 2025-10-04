import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet } from 'react-native';
import { LanguagePicker } from '../language-picker';
import { ThemeSelector } from '../theme-selector';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export const Personalize = ({ width }: { width: number }) => {
  return (
    <ThemedView style={[styles.container, { width }]}>
      <ThemedView style={styles.content}>
        <ThemedText type="h2" style={styles.title}>
          {i18n.t('onb.personalize.title')}
        </ThemedText>
        <ThemeSelector />
        <LanguagePicker />
        <ThemedText type="muted" style={styles.note}>
          You can change this anytime in Settings.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 600,
    gap: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  note: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
