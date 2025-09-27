
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase-config';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';

const getFirebaseAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/too-many-requests':
      return 'You have requested to resend the verification email too many times. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(interval);
          router.replace('/(tabs)');
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  const handleResend = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'No user is currently signed in.');
      return;
    }
    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      Alert.alert('Email Sent', 'A new verification email has been sent to your inbox.');
    } catch (err: any) {
      const friendlyMessage = getFirebaseAuthErrorMessage(err.code);
      Alert.alert('Error', friendlyMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleLoginRedirect = async () => {
    await signOut(auth);
    router.replace('/(auth)/login');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Verify Your Email
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        We've sent a verification link to your email address:
      </ThemedText>
      <ThemedText type="h2" style={styles.email}>
        {email}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Please check your inbox and follow the instructions to verify your account. This window will automatically update once you have been verified.
      </ThemedText>

      {loading && <ActivityIndicator style={styles.loading} />}

      <ThemedButton
        title={isResending ? 'Sending...' : 'Resend Verification Email'}
        onPress={handleResend}
        disabled={isResending}
        variant="secondary"
        style={styles.button}
      />
      <ThemedButton title="Go to Login" onPress={handleLoginRedirect} variant="link" style={styles.linkButton} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 16,
  },
  linkButton: {
    marginTop: 16,
  },
  loading: {
    marginTop: 16,
  },
});
