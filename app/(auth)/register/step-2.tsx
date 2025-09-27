
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  displayName: z.string().min(2, 'Please enter your name.'),
});

export default function RegisterStep2Screen() {
  const router = useRouter();
  const { email, password } = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: '',
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    router.push({
      pathname: '/(auth)/register/step-3',
      params: { email, password, displayName: data.displayName },
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

      <Controller
        control={control}
        name="displayName"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="Full Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            style={styles.input}
          />
        )}
      />
      {errors.displayName && <ThemedText style={styles.error}>{errors.displayName.message}</ThemedText>}

      <ThemedButton title="Continue" onPress={handleSubmit(onSubmit)} style={styles.button} />
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
    alignSelf: 'stretch',
    textAlign: 'center',
    marginBottom: 8,
  },
});
