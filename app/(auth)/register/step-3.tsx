
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase-config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

const schema = z.object({
  age: z.coerce.number().min(13, 'You must be at least 13 years old.'),
});

export default function RegisterStep3Screen() {
  const router = useRouter();
  const { email, password, displayName } = useLocalSearchParams();
  const [submissionError, setSubmissionError] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setSubmissionError('');
    if (!auth) {
      setSubmissionError('Firebase authentication is not configured correctly.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email as string, password as string);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName as string,
        });
        // You would typically save the age (data.age) to a database like Firestore here
        router.push('/(auth)/register/welcome');
      }
    } catch (error: any) {
      setSubmissionError(error.message);
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

      <Controller
        control={control}
        name="age"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="Age"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value?.toString()} // Ensure value is a string for the input
            keyboardType="numeric"
            style={styles.input}
          />
        )}
      />
      {errors.age && <ThemedText style={styles.error}>{errors.age.message}</ThemedText>}
      {submissionError ? <ThemedText style={styles.error}>{submissionError}</ThemedText> : null}

      <ThemedButton title="Complete Registration" onPress={handleSubmit(onSubmit)} style={styles.button} />
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
