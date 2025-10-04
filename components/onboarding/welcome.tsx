import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export const WelcomeSlide = ({ width }: { width: number }) => {
  return (
    <ThemedView style={[styles.container, { width }]}>
      <ThemedView style={styles.content}>
        <ThemedText type="h1" style={styles.title}>
          {i18n.t('onb.welcome.title', { app: 'YourApp' })}
        </ThemedText>
        <ThemedText type="muted" style={styles.body}>
          {i18n.t('onb.welcome.body')}
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
    paddingHorizontal: Spacing.md,
  },
  title: {
    textAlign: 'center',
  },
  body: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
