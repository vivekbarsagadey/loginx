import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedInput } from '@/components/themed-input';
import { Controller, FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import i18n from '@/i18n';

interface FormData {
  firstName: string;
  lastName: string;
}

export default function RegisterStep1({ errors }: { errors: FieldErrors<FormData> }) {
  const { control } = useFormContext();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.title}>
        {i18n.t('register.step1.title')}
      </ThemedText>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput placeholder={i18n.t('register.step1.firstNamePlaceholder')} onBlur={onBlur} onChangeText={onChange} value={value} errorMessage={errors.firstName?.message as string} />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput placeholder={i18n.t('register.step1.lastNamePlaceholder')} onBlur={onBlur} onChangeText={onChange} value={value} errorMessage={errors.lastName?.message as string} />
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
