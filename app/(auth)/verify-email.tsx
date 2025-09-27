
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase-config';
import { useRouter } from 'expo-router';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!auth.currentUser) {
      setError('No user is currently signed in.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage('A new verification email has been sent.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!auth.currentUser) {
      router.replace('/(auth)/login');
      return;
    }
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      router.replace('/(tabs)');
    } else {
      setError('Please verify your email before continuing.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Verify Your Email
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        A verification email has been sent to {auth.currentUser?.email}. Please check your inbox and follow the instructions to verify your account.
      </ThemedText>

      {message ? <ThemedText style={styles.message}>{message}</ThemedText> : null}
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <ThemedButton title="Continue" onPress={handleContinue} style={styles.button} />
      <ThemedButton
        title={loading ? 'Sending...' : 'Resend Verification Email'}
        onPress={handleResend}
        disabled={loading}
        variant="secondary"
        style={styles.button}
      />
      <ThemedButton title="Logout" onPress={handleLogout} variant="link" style={styles.linkButton} />
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
    marginTop: 16,
  },
  linkButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  message: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});
