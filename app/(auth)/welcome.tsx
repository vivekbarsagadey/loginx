
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Registration Successful!
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Thank you for creating an account. We've sent a verification link to your email address:
      </ThemedText>
      <ThemedText type="h2" style={styles.email}>
        {email}
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Please verify your email address to complete the registration process. You can now log in to your account.
      </ThemedText>

      <ThemedButton title="Go to Login" onPress={() => router.replace('/(auth)/login')} style={styles.button} />
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
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  email: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 32,
  },
});
