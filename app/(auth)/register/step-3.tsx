
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedInput } from '@/components/themed-input';
import { useFormContext, Controller } from 'react-hook-form';
import { StyleSheet } from 'react-native';

export default function RegisterStep3() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.title}>Address</ThemedText>
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="Address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.address?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="City"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.city?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="State"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.state?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="zipCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            placeholder="Zip Code"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
            errorMessage={errors.zipCode?.message as string}
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
