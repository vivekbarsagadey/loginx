
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase-config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function RegisterStep3Screen() {
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { email, password, displayName } = useLocalSearchParams();

  const handleRegister = async () => {
    if (!age) {
      setError('Please enter your age.');
      return;
    }
    setError('');

    if (!auth) {
      setError("Firebase authentication is not configured correctly.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email as string, password as string);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName as string,
        });
        // You would typically save the age to a database like Firestore or Realtime Database here
        router.push('/(auth)/register/welcome');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Create Account (Step 3 of 3)
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Just one last thing
      </ThemedText>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <ThemedInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />

      <ThemedButton title="Complete Registration" onPress={handleRegister} style={styles.button} />
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
