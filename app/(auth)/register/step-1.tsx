import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PhotoUpload } from '@/components/ui/photo-upload';
import { ReferralCodeInput } from '@/components/ui/referral-code-input';
import { TermsCheckbox } from '@/components/ui/terms-checkbox';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useAutoFocus } from '@/hooks/use-auto-focus';
import i18n from '@/i18n';
import { useRef } from 'react';
import { Controller, type FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet, type TextInput } from 'react-native';

interface FormData {
  firstName: string;
  lastName: string;
  photoURL?: string;
  termsAccepted: boolean;
  referralCode?: string;
}

export default function RegisterStep1({ errors }: { errors: FieldErrors<FormData> }) {
  const { control } = useFormContext();
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);

  // Auto-focus first input on mount
  useAutoFocus(firstNameRef);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={CommonText.sectionTitle}>
        {i18n.t('register.step1.title')}
      </ThemedText>
      <ThemedText type="caption" style={CommonText.descriptionText}>
        Let&apos;s start with your basic information
      </ThemedText>

      {/* Profile Photo Upload */}
      <Controller
        control={control}
        name="photoURL"
        render={({ field: { onChange, value } }) => (
          <ThemedView style={styles.photoContainer}>
            <PhotoUpload value={value} onChange={onChange} />
          </ThemedView>
        )}
      />

      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={firstNameRef}
            placeholder={i18n.t('register.step1.firstNamePlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.firstName?.message as string}
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="givenName"
            autoComplete="name-given"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
            accessibilityLabel="First name input"
            accessibilityHint="Enter your first name"
            maxLength={50}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={lastNameRef}
            placeholder={i18n.t('register.step1.lastNamePlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.lastName?.message as string}
            autoCapitalize="words"
            autoCorrect={false}
            textContentType="familyName"
            autoComplete="name-family"
            returnKeyType="next"
            accessibilityLabel="Last name input"
            accessibilityHint="Enter your last name"
            maxLength={50}
          />
        )}
      />

      {/* Referral Code Input */}
      <Controller
        control={control}
        name="referralCode"
        render={({ field: { onChange, onBlur, value } }) => <ReferralCodeInput value={value || ''} onChange={onChange} onBlur={onBlur} error={errors.referralCode?.message as string} />}
      />

      {/* Terms & Privacy Checkbox */}
      <Controller
        control={control}
        name="termsAccepted"
        render={({ field: { onChange, value } }) => <TermsCheckbox checked={value} onChange={onChange} error={errors.termsAccepted?.message as string} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  photoContainer: {
    alignSelf: 'center',
    marginVertical: Spacing.md,
  },
});
