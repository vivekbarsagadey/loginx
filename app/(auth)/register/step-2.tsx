
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function RegisterStep2Screen() {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { email, password } = useLocalSearchParams();

  const handleContinue = () => {
    if (!displayName) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    router.push({
      pathname: '/(auth)/register/step-3',
      params: { email, password, displayName },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Create Account (Step 2 of 3)
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Tell us a bit more about yourself
      </ThemedText>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <ThemedInput
        placeholder="Full Name"
        value={displayName}
        onChangeText={setDisplayName}
        autoCapitalize="words"
        style={styles.input}
      />

      <ThemedButton title="Continue" onPress={handleContinue} style={styles.button} />
      <ThemedButton title="Back" variant="secondary" onPress={() => router.back()} style={styles.backButton} />
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
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 32,
  },
  backButton: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});
