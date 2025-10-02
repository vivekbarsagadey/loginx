import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/i18n';
import { useEffect, useRef } from 'react';
import { Controller, FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet, TextInput } from 'react-native';

interface FormData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function RegisterStep3({ errors }: { errors: FieldErrors<FormData> }) {
  const { control } = useFormContext();
  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipCodeRef = useRef<TextInput>(null);

  // Auto-focus address input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      addressRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.title}>
        {i18n.t('register.step3.title')}
      </ThemedText>
      <ThemedText type="caption" style={styles.description}>
        Provide your address information (optional - enhances your experience)
      </ThemedText>

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={addressRef}
            placeholder={i18n.t('register.step3.addressPlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.address?.message as string}
            autoCapitalize="words"
            textContentType="streetAddressLine1"
            autoComplete="street-address"
            returnKeyType="next"
            onSubmitEditing={() => cityRef.current?.focus()}
            accessibilityLabel="Street address input"
            accessibilityHint="Enter your street address"
            maxLength={200}
          />
        )}
      />

      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={cityRef}
            placeholder={i18n.t('register.step3.cityPlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.city?.message as string}
            autoCapitalize="words"
            textContentType="addressCity"
            autoComplete="postal-address-locality"
            returnKeyType="next"
            onSubmitEditing={() => stateRef.current?.focus()}
            accessibilityLabel="City input"
            accessibilityHint="Enter your city name"
            maxLength={100}
          />
        )}
      />

      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={stateRef}
            placeholder={i18n.t('register.step3.statePlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.state?.message as string}
            autoCapitalize="words"
            textContentType="addressState"
            autoComplete="postal-address-region"
            returnKeyType="next"
            onSubmitEditing={() => zipCodeRef.current?.focus()}
            accessibilityLabel="State input"
            accessibilityHint="Enter your state or province"
            maxLength={100}
          />
        )}
      />

      <Controller
        control={control}
        name="zipCode"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={zipCodeRef}
            placeholder={i18n.t('register.step3.zipCodePlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.zipCode?.message as string}
            keyboardType="number-pad"
            textContentType="postalCode"
            autoComplete="postal-code"
            returnKeyType="done"
            accessibilityLabel="Zip code input"
            accessibilityHint="Enter your postal or zip code"
            maxLength={10}
          />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
});
