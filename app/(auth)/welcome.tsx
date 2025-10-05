import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonButtons, CommonContainers, CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  return (
    <ThemedView style={CommonContainers.centeredContainer}>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.welcome.title')}
      </ThemedText>
      <ThemedText style={CommonText.subtitle}>{i18n.t('screens.welcome.subtitle', { email })}</ThemedText>
      <ThemedButton title={i18n.t('screens.welcome.goToLogin')} onPress={() => router.replace('/(auth)/login')} style={CommonButtons.button} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: Spacing.md,
  },
});
