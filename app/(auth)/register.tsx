
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase-config';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    console.log("--- REGISTER BUTTON CLICKED --- START");
    console.log("1. [register.tsx] Email value:", email);
    console.log("2. [register.tsx] Password value (length only for security):", password.length);

    if (!auth) {
      console.error("3. [register.tsx] FATAL: Auth object is undefined! This is the source of the error.");
      setError("Firebase authentication is not configured correctly.");
      console.log("--- REGISTER BUTTON CLICKED --- END");
      return;
    }
    console.log("3. [register.tsx] Auth object is present. App name:", auth.app.name);

    if (!email || !password) {
      setError('Please enter both email and password.');
      console.log("4. [register.tsx] Error: Missing email or password.");
      console.log("--- REGISTER BUTTON CLICKED --- END");
      return;
    }
    try {
      console.log("5. [register.tsx] Calling createUserWithEmailAndPassword...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("6. [register.tsx] Registration successful! User UID:", userCredential.user.uid);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log("7. [register.tsx] Error during registration:", error.code, error.message);
      console.error("Full error object:", error);
      setError(error.message);
    }
    console.log("--- REGISTER BUTTON CLICKED --- END");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Create Account
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Start your journey with us
      </ThemedText>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <ThemedInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <ThemedInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <ThemedButton title="Register" onPress={handleRegister} style={styles.button} />

      <ThemedButton
        title="Already have an account? Login"
        variant="link"
        onPress={() => router.push('/(auth)/login')}
        style={styles.linkButton}
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
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 32,
  },
  linkButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});
