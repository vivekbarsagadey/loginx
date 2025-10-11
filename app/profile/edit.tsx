import { getUserProfile, updateUser } from '@/actions/user.action';
import { ProfileAddressFields } from '@/components/profile/profile-address-fields';
import { ProfileBasicFields } from '@/components/profile/profile-basic-fields';
import { ProfilePhotoSection } from '@/components/profile/profile-photo-section';
import { ScreenWithHeader } from '@/components/templates/screen-with-header';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedView } from '@/components/themed-view';
import { SkeletonAvatar, SkeletonForm, SkeletonLoader } from '@/components/ui/skeleton-loader';
import { Spacing } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import { createLogger } from '@/utils/debug';
import { validateAgeField, validateDisplayNameField, validateZipCodeField } from '@/utils/form-validation';
import { sanitizeUserInput } from '@/utils/sanitize';
import { updateProfile } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, type TextInput } from 'react-native';

const logger = createLogger('EditProfile');

export default function EditProfileScreen() {
  const user = auth.currentUser;
  const { back } = useHapticNavigation();

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

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
        if (profile) {
          setDisplayName(profile.displayName || user.displayName || '');
          setPhotoURL(profile.photoURL || user.photoURL || '');
          setAge(profile.age ? String(profile.age) : '');
          setAddress(profile.address || '');
          setCity(profile.city || '');
          setState(profile.state || '');
          setZipCode(profile.zipCode || '');
        } else {
          // Fallback to auth data
          setDisplayName(user.displayName || '');
          setPhotoURL(user.photoURL || '');
        }
      } catch (error) {
        logger.error('Error loading profile:', error);
        // Fallback to auth data
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Track changes
  useEffect(() => {
    if (!user || initialLoading) {
      return;
    }

    const hasAnyChanges = displayName !== (user.displayName || '') || photoURL !== (user.photoURL || '') || age !== '' || address !== '' || city !== '' || state !== '' || zipCode !== '';

    setHasChanges(hasAnyChanges);
  }, [user, displayName, photoURL, age, address, city, state, zipCode, initialLoading]);

  // Validation functions using centralized utilities
  const validateDisplayName = useCallback((value: string): boolean => {
    const result = validateDisplayNameField(value);
    setDisplayNameError(result.error || '');
    return result.isValid;
  }, []);

  const validateAge = useCallback((value: string): boolean => {
    const result = validateAgeField(value);
    setAgeError(result.error || '');
    return result.isValid;
  }, []);

  const validateZipCode = useCallback((value: string): boolean => {
    const result = validateZipCodeField(value);
    setZipCodeError(result.error || '');
    return result.isValid;
  }, []);

  // Validation function for useFormSubmit
  const validateForm = useCallback(() => {
    const isDisplayNameValid = validateDisplayName(displayName);
    const isAgeValid = validateAge(age);
    const isZipCodeValid = validateZipCode(zipCode);
    return isDisplayNameValid && isAgeValid && isZipCodeValid;
  }, [displayName, age, zipCode, validateDisplayName, validateAge, validateZipCode]);

  // Form submission with hook
  const { submit: handleUpdate, isSubmitting: loading } = useFormSubmit(
    async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const sanitizedDisplayName = sanitizeUserInput(displayName.trim());

      // Update Firebase Auth profile (displayName and photoURL only)
      await updateProfile(user, {
        displayName: sanitizedDisplayName,
        photoURL,
      });

      // Update Firestore with all fields
      const updateData: Record<string, string | number> = {
        displayName: sanitizedDisplayName,
        photoURL,
      };

      if (age) {
        updateData.age = parseInt(age, 10);
      }
      if (address) {
        updateData.address = sanitizeUserInput(address.trim());
      }
      if (city) {
        updateData.city = sanitizeUserInput(city.trim());
      }
      if (state) {
        updateData.state = sanitizeUserInput(state.trim());
      }
      if (zipCode) {
        updateData.zipCode = sanitizeUserInput(zipCode.trim());
      }

      await updateUser(user.uid, updateData);
    },
    {
      successTitle: i18n.t('success.profileUpdate.title'),
      successMessage: i18n.t('success.profileUpdate.message'),
      onSuccess: () => back(),
      validate: validateForm,
    }
  );

  // Handler for photo changes from ProfilePhotoSection
  const handlePhotoChange = useCallback((newPhotoURL: string) => {
    setPhotoURL(newPhotoURL);
    setHasChanges(true);
  }, []);

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
      <ProfilePhotoSection photoURL={photoURL || ''} userId={user?.uid || ''} onPhotoChange={handlePhotoChange} disabled={loading} />

      <ThemedView style={styles.formSection}>
        <ProfileBasicFields
          displayName={displayName}
          displayNameError={displayNameError || ''}
          age={age}
          ageError={ageError || ''}
          onDisplayNameChange={(text) => {
            setDisplayName(text);
            if (displayNameError) {
              setDisplayNameError('');
            }
          }}
          onAgeChange={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            setAge(numericText);
            if (ageError) {
              setAgeError('');
            }
          }}
          onDisplayNameBlur={() => validateDisplayName(displayName)}
          onAgeBlur={() => validateAge(age)}
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
          address={address}
          city={city}
          state={state}
          zipCode={zipCode}
          zipCodeError={zipCodeError || ''}
          onAddressChange={setAddress}
          onCityChange={setCity}
          onStateChange={(text) => setState(text.toUpperCase())}
          onZipCodeChange={(text) => {
            setZipCode(text);
            if (zipCodeError) {
              setZipCodeError('');
            }
          }}
          onZipCodeBlur={() => validateZipCode(zipCode)}
          addressInputRef={addressInputRef}
          cityInputRef={cityInputRef}
          stateInputRef={stateInputRef}
          zipCodeInputRef={zipCodeInputRef}
          disabled={loading}
        />
      </ThemedView>

      <ThemedButton title={loading ? i18n.t('profile.edit.savingButton') : i18n.t('profile.edit.saveButton')} onPress={handleUpdate} disabled={loading || !hasChanges} loading={loading} />
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
