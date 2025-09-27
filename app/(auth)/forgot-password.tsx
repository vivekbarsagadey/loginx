
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { auth } from '@/firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedInput } from '@/components/themed-input';
import { ThemedButton } from '@/components/themed-button';
import { useRouter } from 'expo-router';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Reset Password
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Enter your email to receive a reset link
      </ThemedText>

      {message && <ThemedText style={styles.message}>{message}</ThemedText>}
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        )}
      />
      {errors.email && <ThemedText style={styles.error}>{`${errors.email.message}`}</ThemedText>}

      <ThemedButton
        title={loading ? 'Sending...' : 'Send Reset Link'}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        style={styles.button}
      />

      <ThemedButton
        title="Back to Login"
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
