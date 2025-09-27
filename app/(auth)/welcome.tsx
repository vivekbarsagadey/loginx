
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>Welcome!</ThemedText>
      <ThemedText style={styles.subtitle}>
        You have successfully registered with the email: {email}
      </ThemedText>
      <ThemedButton
        title="Go to Login"
        onPress={() => router.replace('/login')}
        style={styles.button}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
});
