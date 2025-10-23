import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createLogger } from '@/utils/debug';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete, type GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';

const logger = createLogger('AddressAutocomplete');

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

  // Check if API key is valid (not a placeholder)
  const isValidApiKey = googleApiKey && googleApiKey.trim() !== '' && !googleApiKey.includes('your-google-places-api-key') && !googleApiKey.includes('yourkey');

  const [manualMode] = useState(!isValidApiKey);

  useEffect(() => {
    if (initialValue && ref.current && !manualMode) {
      ref.current.setAddressText(initialValue);
    }
  }, [initialValue, manualMode]);

  const parseAddressComponents = (details: unknown): AddressComponents => {
    try {
      if (!details || typeof details !== 'object') {
        throw new Error('Invalid details object');
      }

      const addressComponents = (details as { address_components?: { types: string[]; long_name: string; short_name: string }[] })?.address_components || [];

      const getComponent = (type: string, useShort = false) => {
        try {
          const component = addressComponents.find((c) => c && c.types && Array.isArray(c.types) && c.types.includes(type));
          return component ? (useShort ? component.short_name : component.long_name) : '';
        } catch (_error: unknown) {
          return '';
        }
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
    } catch (_error: unknown) {
      logger.error('Error parsing address components:', error);
      // Return a fallback object
      return {
        fullAddress: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      };
    }
  };

  // Fallback to manual input if no valid API key - return null to let parent handle manual entry
  if (manualMode || !isValidApiKey) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Start typing your address..."
        fetchDetails={true}
        onPress={(data, details = null) => {
          try {
            if (details) {
              const addressComponents = parseAddressComponents(details);
              onAddressSelect(addressComponents);
            }
          } catch (_error: unknown) {
            logger.error('Error parsing address:', error);
            // Fallback - use the basic address text
            onAddressSelect({
              fullAddress: data.description || '',
              street: data.description || '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
            });
          }
        }}
        onFail={(_error) => {
          logger.error('GooglePlacesAutocomplete error:', error);
        }}
        query={{
          key: isValidApiKey ? googleApiKey : '',
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
        suppressDefaultStyles={false}
        keepResultsAfterBlur={false}
        listEmptyComponent={() => (
          <ThemedText type="caption" style={[styles.helperText, { textAlign: 'center', padding: 16 }]}>
            No results found
          </ThemedText>
        )}
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
