
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        MyApp
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Your awesome app tagline
      </ThemedText>

      <ThemedButton
        title="Login"
        onPress={() => router.push('/(auth)/login')}
        style={styles.button}
      />
      <ThemedButton
        title="Create Account"
        onPress={() => router.push('/(auth)/register')}
        style={styles.button}
        variant="secondary"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    marginVertical: 8,
  },
});
