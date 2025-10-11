import { ThemedInput } from '@/components/themed-input';
import { ThemedLoadingSpinner } from '@/components/themed-loading-spinner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter';
import { Spacing, Typography } from '@/constants/layout';
import { useEmailAvailability } from '@/hooks/use-email-availability';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Controller, type FieldErrors, useFormContext } from 'react-hook-form';
import { StyleSheet, type TextInput, View } from 'react-native';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterStep2({ errors }: { errors: FieldErrors<FormData> }) {
  const { control, watch } = useFormContext();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [passwordValue, setPasswordValue] = useState('');
  const emailValue = watch('email');

  // Email availability checking
  const { status: emailStatus, message: emailMessage, checkEmail } = useEmailAvailability();

  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');

  // Auto-focus email input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      emailRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check email availability when email changes
  useEffect(() => {
    if (emailValue && typeof emailValue === 'string') {
      checkEmail(emailValue);
    }
  }, [emailValue, checkEmail]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h2" style={styles.sectionTitle}>
        {i18n.t('register.step2.title')}
      </ThemedText>
      <ThemedText type="caption" style={styles.descriptionText}>
        Create your login credentials
      </ThemedText>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <View style={styles.inputWithIcon}>
              <ThemedInput
                ref={emailRef}
                placeholder={i18n.t('register.step2.emailPlaceholder')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message as string}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityLabel="Email address input"
                accessibilityHint="Enter your email address for account login"
                maxLength={254}
              />
              {emailStatus === 'checking' && (
                <View style={styles.statusIcon}>
                  <ThemedLoadingSpinner size="small" />
                </View>
              )}
              {emailStatus === 'available' && !errors.email && (
                <View style={styles.statusIcon}>
                  <Ionicons name="checkmark-circle" size={20} color={successColor} />
                </View>
              )}
              {emailStatus === 'unavailable' && (
                <View style={styles.statusIcon}>
                  <Ionicons name="close-circle" size={20} color={errorColor} />
                </View>
              )}
            </View>
            {emailStatus === 'available' && !errors.email && (
              <ThemedText type="caption" style={[styles.statusText, { color: successColor }]}>
                {emailMessage}
              </ThemedText>
            )}
            {emailStatus === 'unavailable' && (
              <ThemedText type="caption" style={[styles.statusText, { color: errorColor }]}>
                {emailMessage}
              </ThemedText>
            )}
          </View>
        )}
      />

      <View style={styles.passwordSection}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <ThemedInput
                ref={passwordRef}
                placeholder={i18n.t('register.step2.passwordPlaceholder')}
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  setPasswordValue(text);
                }}
                value={value}
                errorMessage={errors.password?.message as string}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="password-new"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                accessibilityLabel="Password input"
                accessibilityHint="Create a strong password with at least 8 characters, including uppercase, lowercase, number, and special character"
                maxLength={128}
              />
              {passwordValue && <PasswordStrengthMeter password={passwordValue} />}
            </View>
          )}
        />

        <ThemedText type="caption" style={styles.helperText}>
          Password must contain:
          {`\n`}• At least 8 characters
          {`\n`}• Uppercase and lowercase letters
          {`\n`}• At least one number
          {`\n`}• At least one special character (@$!%*?&)
        </ThemedText>
      </View>

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            ref={confirmPasswordRef}
            placeholder={i18n.t('register.step2.confirmPasswordPlaceholder')}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.confirmPassword?.message as string}
            secureTextEntry
            textContentType="newPassword"
            autoComplete="password-new"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            accessibilityLabel="Confirm password input"
            accessibilityHint="Re-enter your password to confirm"
            maxLength={128}
          />
        )}
      />
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
  emailContainer: {
    gap: Spacing.sm,
  },
  inputWithIcon: {
    position: 'relative',
  },
  statusIcon: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    zIndex: 10,
  },
  statusText: {
    marginTop: Spacing.xs,
    fontSize: Typography.small.fontSize,
  },
  passwordSection: {
    gap: Spacing.sm,
  },
  helperText: {
    opacity: 0.7,
    lineHeight: Typography.caption.lineHeight,
  },
});
