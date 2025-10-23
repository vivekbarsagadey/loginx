import { getUserProfile, updateUser } from '@/actions/user.action';
import { ProfileAddressFields } from '@/components/profile/profile-address-fields';
import { ProfileBasicFields } from '@/components/profile/profile-basic-fields';
import { ProfilePhotoSection } from '@/components/profile/profile-photo-section';
import { ScreenWithHeader } from '@/components/templates/screen-with-header';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedView } from '@/components/themed-view';
import { SkeletonAvatar, SkeletonForm, SkeletonLoader } from '@/components/ui/skeleton-loader';
import { SuccessAnimation } from '@/components/ui/success-animation';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useForm } from '@/hooks/utility/use-form';
import { useToggle } from '@/hooks/utility/use-toggle';
import i18n from '@/i18n';
import { createLogger } from '@/utils/debug';
import { validateAgeField, validateDisplayNameField, validateZipCodeField } from '@/utils/form-validation';
import { sanitizeUserInput } from '@/utils/sanitize';
import { updateProfile } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, type TextInput } from 'react-native';

const logger = createLogger('EditProfile');

interface ProfileFormValues {
  displayName: string;
  photoURL: string;
  age: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  [key: string]: unknown;
}

export default function EditProfileScreen() {
  const user = auth.currentUser;
  const { back } = useHapticNavigation();

  // Loading states - using useToggle for boolean states
  const [initialLoading, setInitialLoading] = useState(true);
  const [showSuccessAnimation, toggleSuccessAnimation] = useToggle(false);

  // Form state management with useForm hook
  const form = useForm<ProfileFormValues>({
    initialValues: {
      displayName: '',
      photoURL: '',
      age: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    validations: {
      displayName: {
        required: true,
        validate: (value) => {
          const result = validateDisplayNameField(value as string);
          return result.error || null;
        },
      },
      age: {
        validate: (value) => {
          if (!value) {
            return null;
          } // Age is optional
          const result = validateAgeField(value as string);
          return result.error || null;
        },
      },
      zipCode: {
        validate: (value) => {
          if (!value) {
            return null;
          } // Zip code is optional
          const result = validateZipCodeField(value as string);
          return result.error || null;
        },
      },
    },
  });

  // Refs for input focus management
  const ageInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);
  const cityInputRef = useRef<TextInput>(null);
  const stateInputRef = useRef<TextInput>(null);
  const zipCodeInputRef = useRef<TextInput>(null);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) {
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        const newValues: ProfileFormValues = profile
          ? {
              displayName: profile.displayName || user.displayName || '',
              photoURL: profile.photoURL || user.photoURL || '',
              age: profile.age ? String(profile.age) : '',
              address: profile.address || '',
              city: profile.city || '',
              state: profile.state || '',
              zipCode: profile.zipCode || '',
            }
          : {
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              age: '',
              address: '',
              city: '',
              state: '',
              zipCode: '',
            };

        form.setValues(newValues);
      } catch (_error: unknown) {
        logger.error('Error loading profile:', error);
        // Fallback to auth data
        form.setValues({
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          age: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Form submission with hook
  const { submit: handleUpdate, isSubmitting: loading } = useFormSubmit(
    async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const sanitizedDisplayName = sanitizeUserInput(form.values.displayName.trim());

      // Update Firebase Auth profile (displayName and photoURL only)
      await updateProfile(user, {
        displayName: sanitizedDisplayName,
        photoURL: form.values.photoURL,
      });

      // Update Firestore with all fields
      const updateData: Record<string, string | number> = {
        displayName: sanitizedDisplayName,
        photoURL: form.values.photoURL,
      };

      if (form.values.age) {
        updateData.age = parseInt(form.values.age, 10);
      }
      if (form.values.address) {
        updateData.address = sanitizeUserInput(form.values.address.trim());
      }
      if (form.values.city) {
        updateData.city = sanitizeUserInput(form.values.city.trim());
      }
      if (form.values.state) {
        updateData.state = sanitizeUserInput(form.values.state.trim());
      }
      if (form.values.zipCode) {
        updateData.zipCode = sanitizeUserInput(form.values.zipCode.trim());
      }

      await updateUser(user.uid, updateData);
    },
    {
      successTitle: i18n.t('success.profileUpdate.title'),
      successMessage: i18n.t('success.profileUpdate.message'),
      onSuccess: () => {
        toggleSuccessAnimation();
        // Navigate back after animation completes
      },
      validate: async () => form.validateForm(),
    }
  );

  // Handler for photo changes from ProfilePhotoSection
  const handlePhotoChange = useCallback(
    (newPhotoURL: string) => {
      form.setValue('photoURL', newPhotoURL);
    },
    [form]
  );

  // Show loading state while fetching profile
  if (initialLoading) {
    return (
      <ScreenWithHeader title="Edit Profile" showBackButton>
        <ThemedView style={styles.avatarSection}>
          <SkeletonAvatar size={128} shimmer />
          <SkeletonLoader height={16} width={120} style={{ marginTop: Spacing.md }} shimmer />
        </ThemedView>

        <ThemedView style={styles.formSection}>
          <SkeletonLoader height={16} width={150} style={{ marginBottom: Spacing.md }} shimmer />
          <SkeletonForm shimmer />
        </ThemedView>
      </ScreenWithHeader>
    );
  }

  return (
    <ScreenWithHeader title="Edit Profile" showBackButton>
      <ProfilePhotoSection photoURL={form.values.photoURL || ''} userId={user?.uid || ''} onPhotoChange={handlePhotoChange} disabled={loading} />

      <ThemedView style={styles.formSection}>
        <ProfileBasicFields
          displayName={form.values.displayName}
          displayNameError={(form.touched.displayName && form.errors.displayName) || ''}
          age={form.values.age}
          ageError={(form.touched.age && form.errors.age) || ''}
          onDisplayNameChange={(text) => {
            form.setValue('displayName', text);
            if (form.errors.displayName) {
              form.setError('displayName', '');
            }
          }}
          onAgeChange={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            form.setValue('age', numericText);
            if (form.errors.age) {
              form.setError('age', '');
            }
          }}
          onDisplayNameBlur={form.handleBlur('displayName')}
          onAgeBlur={form.handleBlur('age')}
          ageInputRef={ageInputRef}
          disabled={loading}
        />

        <ThemedInput
          label="Email Address"
          value={user?.email || ''}
          editable={false}
          selectTextOnFocus={false}
          style={styles.disabledInput}
          helperText="To change your email, use the Update Email option in Settings"
        />

        <ProfileAddressFields
          address={form.values.address}
          city={form.values.city}
          state={form.values.state}
          zipCode={form.values.zipCode}
          zipCodeError={(form.touched.zipCode && form.errors.zipCode) || ''}
          onAddressChange={(text) => form.setValue('address', text)}
          onCityChange={(text) => form.setValue('city', text)}
          onStateChange={(text) => form.setValue('state', text.toUpperCase())}
          onZipCodeChange={(text) => {
            form.setValue('zipCode', text);
            if (form.errors.zipCode) {
              form.setError('zipCode', '');
            }
          }}
          onZipCodeBlur={form.handleBlur('zipCode')}
          addressInputRef={addressInputRef}
          cityInputRef={cityInputRef}
          stateInputRef={stateInputRef}
          zipCodeInputRef={zipCodeInputRef}
          disabled={loading}
        />
      </ThemedView>

      <ThemedButton title={loading ? i18n.t('profile.edit.savingButton') : i18n.t('profile.edit.saveButton')} onPress={handleUpdate} disabled={loading || !form.isDirty} loading={loading} />

      {/* Success animation */}
      <SuccessAnimation
        visible={showSuccessAnimation}
        title={i18n.t('success.profileUpdate.title')}
        message={i18n.t('success.profileUpdate.message')}
        onComplete={() => {
          toggleSuccessAnimation();
          back();
        }}
      />
    </ScreenWithHeader>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  formSection: {
    gap: Spacing.md,
  },
  disabledInput: {
    opacity: 0.6,
  },
});
