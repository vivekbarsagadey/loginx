import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export const WelcomeSlide = ({ width }: { width: number }) => {
  return (
    <ThemedView style={[styles.container, { width }]}>
      <ThemedText type="h1">{i18n.t('onb.welcome.title', { app: 'YourApp' })}</ThemedText>
      <ThemedText type="muted" style={styles.body}>
        {i18n.t('onb.welcome.body')}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    flex: 1,
    justifyContent: 'center',
  },
  body: {
    marginTop: Spacing.sm,
  },
});
