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
      <ThemedText type="h2">{i18n.t('onb.personalize.title')}</ThemedText>
      <ThemeSelector />
      <LanguagePicker />
      <ThemedText type="muted" style={styles.note}>
        You can change this anytime in Settings.
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.md,
    flex: 1,
    justifyContent: 'center',
  },
  note: {
    fontSize: 13,
  },
});
