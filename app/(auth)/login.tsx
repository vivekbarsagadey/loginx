
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase-config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function LoginScreen() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setSubmissionError('');
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // The user will be redirected to the main app by the root layout observer
    } catch (error: any) {
      setSubmissionError(error.message);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Welcome Back
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Sign in to continue
      </ThemedText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        )}
      />
      {errors.email && <ThemedText style={styles.error}>{errors.email.message}</ThemedText>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            style={styles.input}
          />
        )}
      />
      {errors.password && <ThemedText style={styles.error}>{errors.password.message}</ThemedText>}
      {submissionError ? <ThemedText style={styles.error}>{submissionError}</ThemedText> : null}


      <ThemedButton
        title="Forgot Password?"
        variant="link"
        onPress={() => router.push('/(auth)/forgot-password')}
        style={styles.linkButton}
      />

      <ThemedButton title="Login" onPress={handleSubmit(onSubmit)} style={styles.button} />

      <ThemedButton
        title="Don't have an account? Register"
        variant="link"
        onPress={() => router.push('/(auth)/register')}
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
    alignSelf: 'stretch',
    textAlign: 'center',
    marginBottom: 8,
  },
});
