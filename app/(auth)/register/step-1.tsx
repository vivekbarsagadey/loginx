
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedInput } from '@/components/themed-input';
import { useFormContext, Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';

export default function RegisterStep1() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.title}>Personal Information</ThemedText>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="First Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.firstName?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="Last Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.lastName?.message as string}
          />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
});
