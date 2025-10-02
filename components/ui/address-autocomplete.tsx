import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';

interface AddressAutocompleteProps {
  onAddressSelect: (address: AddressComponents) => void;
  initialValue?: string;
  googleApiKey?: string;
}

export interface AddressComponents {
  fullAddress: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Address Autocomplete Component
 * Uses Google Places API to provide address suggestions
 */
export function AddressAutocomplete({ onAddressSelect, initialValue, googleApiKey }: AddressAutocompleteProps) {
  const ref = useRef<GooglePlacesAutocompleteRef>(null);
  const textColor = useThemeColor({}, 'text');
  const bgColor = useThemeColor({}, 'bg');
  const borderColor = useThemeColor({}, 'border');
  const surfaceColor = useThemeColor({}, 'surface');

  const [manualMode] = useState(!googleApiKey);

  useEffect(() => {
    if (initialValue && ref.current) {
      ref.current.setAddressText(initialValue);
    }
  }, [initialValue]);

  const parseAddressComponents = (details: unknown): AddressComponents => {
    const addressComponents = (details as { address_components?: { types: string[]; long_name: string; short_name: string }[] })?.address_components || [];

    const getComponent = (type: string, useShort = false) => {
      const component = addressComponents.find((c) => c.types.includes(type));
      return component ? (useShort ? component.short_name : component.long_name) : '';
    };

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');
    const street = `${streetNumber} ${route}`.trim();

    return {
      fullAddress: (details as { formatted_address?: string })?.formatted_address || '',
      street,
      city: getComponent('locality') || getComponent('sublocality') || getComponent('administrative_area_level_2'),
      state: getComponent('administrative_area_level_1', true),
      zipCode: getComponent('postal_code'),
      country: getComponent('country', true),
    };
  };

  // Fallback to manual input if no API key
  if (manualMode || !googleApiKey) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="caption" style={styles.helperText}>
          Google Places API key not configured. Using manual address entry.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Start typing your address..."
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details) {
            const addressComponents = parseAddressComponents(details);
            onAddressSelect(addressComponents);
          }
        }}
        query={{
          key: googleApiKey,
          language: 'en',
          components: 'country:us', // Restrict to US addresses (change as needed)
        }}
        styles={{
          container: {
            flex: 0,
          },
          textInputContainer: {
            backgroundColor: bgColor,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            height: 48,
            color: textColor,
            fontSize: 16,
            backgroundColor: surfaceColor,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: borderColor,
            paddingHorizontal: 16,
          },
          listView: {
            backgroundColor: surfaceColor,
            borderRadius: 12,
            marginTop: 8,
            borderWidth: 1,
            borderColor: borderColor,
          },
          row: {
            backgroundColor: surfaceColor,
            padding: 13,
            height: 54,
            flexDirection: 'row',
          },
          separator: {
            height: 1,
            backgroundColor: borderColor,
          },
          description: {
            color: textColor,
          },
          poweredContainer: {
            display: 'none', // Hide "Powered by Google" for cleaner look
          },
        }}
        textInputProps={{
          placeholderTextColor: `${textColor}80`, // 50% opacity
          returnKeyType: 'search',
          autoCapitalize: 'words',
        }}
        enablePoweredByContainer={false}
        debounce={400}
        minLength={3}
        nearbyPlacesAPI="GooglePlacesSearch"
        GooglePlacesSearchQuery={{
          rankby: 'distance',
        }}
      />

      <ThemedText type="caption" style={[styles.helperText, { color: textColor }]}>
        Start typing to see address suggestions
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    zIndex: 1000, // Ensure dropdown appears above other elements
  },
  helperText: {
    marginTop: 8,
    opacity: 0.7,
  },
});
