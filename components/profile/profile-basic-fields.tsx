import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet, type TextInput } from 'react-native';

interface ProfileBasicFieldsProps {
  displayName: string;
  displayNameError: string;
  age: string;
  ageError: string;
  onDisplayNameChange: (text: string) => void;
  onAgeChange: (text: string) => void;
  onDisplayNameBlur?: () => void;
  onAgeBlur?: () => void;
  ageInputRef?: React.RefObject<TextInput | null>;
  disabled?: boolean;
}

export function ProfileBasicFields({ displayName, displayNameError, age, ageError, onDisplayNameChange, onAgeChange, ageInputRef, disabled = false }: ProfileBasicFieldsProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={CommonText.sectionTitle}>Basic Information</ThemedText>

      <ThemedInput
        label={i18n.t('profile.edit.nameLabel')}
        value={displayName}
        onChangeText={onDisplayNameChange}
        placeholder={i18n.t('profile.edit.namePlaceholder')}
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={() => ageInputRef?.current?.focus()}
        errorMessage={displayNameError}
        style={styles.input}
        editable={!disabled}
      />

      <ThemedInput
        ref={ageInputRef}
        label={i18n.t('profile.edit.ageLabel')}
        value={age}
        onChangeText={onAgeChange}
        placeholder={i18n.t('profile.edit.agePlaceholder')}
        keyboardType="numeric"
        returnKeyType="done"
        errorMessage={ageError}
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
