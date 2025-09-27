
import { useState } from 'react';
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
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

const getFirebaseAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No user found with this email address. Please register or try a different email.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
};

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      Alert.alert(
        'Password Reset Email Sent',
        'Please check your inbox for a link to reset your password.',
        [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
      );
    } catch (err: any) {
      const friendlyMessage = getFirebaseAuthErrorMessage(err.code);
      Alert.alert('Error', friendlyMessage);
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
            errorMessage={errors.email?.message}
            style={styles.input}
          />
        )}
      />

      <ThemedButton
        title={loading ? 'Sending...' : 'Send Reset Link'}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        style={styles.button}
      />
      {loading && <ActivityIndicator style={styles.loading} />}

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
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
