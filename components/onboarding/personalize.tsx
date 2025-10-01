import { LanguagePicker } from '../language-picker';
import { ThemeSelector } from '../theme-selector';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import i18n from '@/i18n';

export const Personalize = ({ width }: { width: number }) => {
  return (
    <ThemedView style={{ width, padding: 24, gap: 16, flex: 1, justifyContent: 'center' }}>
      <ThemedText type="h2">{i18n.t('onb.personalize.title')}</ThemedText>
      <ThemeSelector />
      <LanguagePicker />
      <ThemedText type="muted" style={{ fontSize: 13 }}>
        You can change this anytime in Settings.
      </ThemedText>
    </ThemedView>
  );
};
