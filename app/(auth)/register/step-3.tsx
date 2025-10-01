import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedInput } from '@/components/themed-input';
import { Controller, FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import i18n from '@/i18n';

interface FormData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function RegisterStep3({ errors }: { errors: FieldErrors<FormData> }) {
  const { control } = useFormContext();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.title}>
        {i18n.t('register.step3.title')}
      </ThemedText>
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput placeholder={i18n.t('register.step3.addressPlaceholder')} onBlur={onBlur} onChangeText={onChange} value={value} errorMessage={errors.address?.message as string} />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput placeholder={i18n.t('register.step3.cityPlaceholder')} onBlur={onBlur} onChangeText={onChange} value={value} errorMessage={errors.city?.message as string} />
        )}
      />
      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput placeholder={i18n.t('register.step3.statePlaceholder')} onBlur={onBlur} onChangeText={onChange} value={value} errorMessage={errors.state?.message as string} />
        )}
      />
      <Controller
        control={control}
        name="zipCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput placeholder={i18n.t('register.step3.zipCodePlaceholder')} onBlur={onBlur} onChangeText={onChange} value={value} errorMessage={errors.zipCode?.message as string} />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1, // Removed this line
  },
  title: {
    marginBottom: 16,
  },
});
