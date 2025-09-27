
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string()
    .min(5, 'Password must be at least 5 characters long.')
    .regex(/^[a-zA-Z0-9@$]*$/, 'Password can only contain alphanumeric characters, @, and $.'),
});

export default function RegisterStep1Screen() {
  const router = useRouter();
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

  const onSubmit = (data: z.infer<typeof schema>) => {
    router.push({
      pathname: '/(auth)/register/step-2',
      params: { email: data.email, password: data.password },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        Create Account (Step 1 of 3)
      </ThemedText>
      <ThemedText type="body" style={styles.subtitle}>
        Start your journey with us
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

      <ThemedButton title="Continue" onPress={handleSubmit(onSubmit)} style={styles.button} />

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
    alignSelf: 'stretch',
    textAlign: 'center',
    marginBottom: 8,
  },
});
