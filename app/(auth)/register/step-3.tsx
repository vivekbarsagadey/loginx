import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AddressAutocomplete, type AddressComponents } from '@/components/ui/address-autocomplete';
import { Spacing, Typography } from '@/constants/layout';
import { useTimeout } from '@/hooks/timing/use-timeout';
import i18n from '@/i18n';
import { GOOGLE_PLACES_API_KEY } from '@/utils/env';
import { useRef, useState } from 'react';
import { Controller, type FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet, type TextInput } from 'react-native';

interface FormData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function RegisterStep3({ errors }: { errors: FieldErrors<FormData> }) {
  const { control, setValue } = useFormContext();
  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipCodeRef = useRef<TextInput>(null);

  // Check if API key is valid (not a placeholder)
  const isValidApiKey = GOOGLE_PLACES_API_KEY && GOOGLE_PLACES_API_KEY.trim() !== '' && !GOOGLE_PLACES_API_KEY.includes('your-google-places-api-key') && !GOOGLE_PLACES_API_KEY.includes('yourkey');

  const [useAutocomplete, setUseAutocomplete] = useState(isValidApiKey);

  // Auto-focus address input on mount using useTimeout
  useTimeout(() => {
    if (!useAutocomplete) {
      addressRef.current?.focus();
    }
  }, 100);

  const handleAddressSelect = (addressComponents: AddressComponents) => {
    setValue('address', addressComponents.street);
    setValue('city', addressComponents.city);
    setValue('state', addressComponents.state);
    setValue('zipCode', addressComponents.zipCode);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.sectionTitle}>
        {i18n.t('register.step3.title')}
      </ThemedText>
      <ThemedText type="caption" style={styles.descriptionText}>
        Provide your address information (optional - enhances your experience)
      </ThemedText>

      {/* Show helpful message when autocomplete is not available */}
      {!isValidApiKey && (
        <ThemedText type="caption" style={styles.infoText}>
          💡 Fill in your address details below
        </ThemedText>
      )}

      {/* Show autocomplete if available */}
      {useAutocomplete && isValidApiKey && (
        <>
          <AddressAutocomplete onAddressSelect={handleAddressSelect} googleApiKey={GOOGLE_PLACES_API_KEY} />
          <ThemedText type="caption" style={styles.manualLink} onPress={() => setUseAutocomplete(false)} accessibilityRole="button" accessibilityLabel="Switch to manual address entry">
            Or enter address manually
          </ThemedText>
        </>
      )}

      {/* Always show manual inputs unless autocomplete is actively being used */}
      {(!useAutocomplete || !isValidApiKey) && (
        <>
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
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },
  descriptionText: {
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  infoText: {
    marginBottom: Spacing.md,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  manualLink: {
    marginTop: Spacing.sm,
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
});
