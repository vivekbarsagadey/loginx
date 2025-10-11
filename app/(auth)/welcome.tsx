import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function WelcomeScreen() {
  const { replace } = useHapticNavigation();
  const { email } = useLocalSearchParams();

  return (
    <ThemedView style={styles.centeredContainer}>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.welcome.title')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('screens.welcome.subtitle', { email })}</ThemedText>
      <ThemedButton title={i18n.t('screens.welcome.goToLogin')} onPress={() => replace('/(auth)/login')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
});
