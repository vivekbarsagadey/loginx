import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet, type TextInput } from 'react-native';

interface ProfileAddressFieldsProps {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  zipCodeError: string;
  onAddressChange: (text: string) => void;
  onCityChange: (text: string) => void;
  onStateChange: (text: string) => void;
  onZipCodeChange: (text: string) => void;
  onZipCodeBlur?: () => void;
  addressInputRef?: React.RefObject<TextInput | null>;
  cityInputRef?: React.RefObject<TextInput | null>;
  stateInputRef?: React.RefObject<TextInput | null>;
  zipCodeInputRef?: React.RefObject<TextInput | null>;
  disabled?: boolean;
}

export function ProfileAddressFields({
  address,
  city,
  state,
  zipCode,
  zipCodeError,
  onAddressChange,
  onCityChange,
  onStateChange,
  onZipCodeChange,
  addressInputRef,
  cityInputRef,
  stateInputRef,
  zipCodeInputRef,
  disabled = false,
}: ProfileAddressFieldsProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={CommonText.sectionTitle}>Address (Optional)</ThemedText>

      <ThemedInput
        ref={addressInputRef}
        label={i18n.t('profile.edit.addressLabel')}
        value={address}
        onChangeText={onAddressChange}
        placeholder={i18n.t('profile.edit.addressPlaceholder')}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => cityInputRef?.current?.focus()}
        style={styles.input}
        editable={!disabled}
      />

      <ThemedInput
        ref={cityInputRef}
        label={i18n.t('profile.edit.cityLabel')}
        value={city}
        onChangeText={onCityChange}
        placeholder={i18n.t('profile.edit.cityPlaceholder')}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => stateInputRef?.current?.focus()}
        style={styles.input}
        editable={!disabled}
      />

      <ThemedInput
        ref={stateInputRef}
        label={i18n.t('profile.edit.stateLabel')}
        value={state}
        onChangeText={onStateChange}
        placeholder={i18n.t('profile.edit.statePlaceholder')}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => zipCodeInputRef?.current?.focus()}
        style={styles.input}
        editable={!disabled}
      />

      <ThemedInput
        ref={zipCodeInputRef}
        label={i18n.t('profile.edit.zipCodeLabel')}
        value={zipCode}
        onChangeText={onZipCodeChange}
        placeholder={i18n.t('profile.edit.zipCodePlaceholder')}
        keyboardType="numeric"
        returnKeyType="done"
        errorMessage={zipCodeError}
        style={styles.input}
        editable={!disabled}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  input: {
    marginBottom: Spacing.md,
  },
});
