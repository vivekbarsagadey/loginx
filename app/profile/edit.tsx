import { getUserProfile, updateUser } from '@/actions/user.action';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SkeletonAvatar, SkeletonForm, SkeletonLoader } from '@/components/ui/skeleton-loader';
import { AccessibilityHints, AccessibilityRoles } from '@/constants/accessibility';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { ValidationConstants } from '@/constants/validation';
import { auth } from '@/firebase-config';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { validateAgeField, validateDisplayNameField, validateZipCodeField } from '@/utils/form-validation';
import { sanitizeUserInput } from '@/utils/sanitize';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, type TextInput, TouchableOpacity } from 'react-native';

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
  const [imageLoading, setImageLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Refs for input focus management
  const ageInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);
  const cityInputRef = useRef<TextInput>(null);
  const stateInputRef = useRef<TextInput>(null);
  const zipCodeInputRef = useRef<TextInput>(null);

  // Theme colors
  const tintColor = useThemeColor({}, 'primary');
  const overlayColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

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
        console.error('[EditProfile] Error loading profile:', error);
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

  const handleImagePick = useCallback(async () => {
    try {
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showError(new Error(i18n.t('errors.profile.permission.message')));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageLoading(true);
        try {
          const asset = result.assets[0];

          // Validate file size (max 5MB)
          if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            showError(new Error('Image must be smaller than 5MB. Please select a smaller image.'));
            return;
          }

          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const storage = getStorage();
          const storageRef = ref(storage, `avatars/${user?.uid}_${Date.now()}`);

          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          setPhotoURL(downloadURL);
          setHasChanges(true);

          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
          console.error('[EditProfile] Error uploading image:', error);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          showError(error);
        } finally {
          setImageLoading(false);
        }
      }
    } catch (error) {
      console.error('[EditProfile] Error picking image:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
      setImageLoading(false);
    }
  }, [user?.uid]);

  const defaultAvatarUri = 'https://www.gravatar.com/avatar/?d=mp&s=256';

  // Show loading state while fetching profile
  if (initialLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedScrollView contentContainerStyle={styles.scrollContent}>
          {/* Avatar Skeleton */}
          <ThemedView style={styles.avatarSection}>
            <SkeletonAvatar size={128} shimmer />
            <SkeletonLoader height={16} width={120} style={{ marginTop: Spacing.md }} shimmer />
          </ThemedView>

          {/* Form Skeleton */}
          <ThemedView style={styles.formSection}>
            <SkeletonLoader height={16} width={150} style={{ marginBottom: Spacing.md }} shimmer />
            <SkeletonForm shimmer />
          </ThemedView>
        </ThemedScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Avatar Section */}
        <ThemedView style={styles.avatarSection}>
          <TouchableOpacity
            onPress={handleImagePick}
            style={[styles.avatarContainer, { borderColor }]}
            disabled={imageLoading || loading}
            accessible={true}
            accessibilityRole={AccessibilityRoles.BUTTON}
            accessibilityLabel="Change profile photo"
            accessibilityHint={AccessibilityHints.BUTTON_TAP}
          >
            <Image source={{ uri: photoURL || defaultAvatarUri }} style={[styles.avatar, { borderColor }]} accessibilityIgnoresInvertColors={true} />
            {imageLoading && (
              <ThemedView style={[styles.imageLoadingOverlay, { backgroundColor: overlayColor + '80' }]}>
                <ActivityIndicator size="large" color={tintColor} />
                <ThemedText style={[styles.uploadingText, { color: tintColor }]}>Uploading...</ThemedText>
              </ThemedView>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleImagePick} disabled={imageLoading || loading} accessible={true} accessibilityRole={AccessibilityRoles.BUTTON} accessibilityLabel="Change profile photo">
            <ThemedText style={[styles.changePhotoText, { color: tintColor }]}>{imageLoading ? 'Uploading...' : i18n.t('profile.edit.changePhoto')}</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Form Section */}
        <ThemedView style={styles.formSection}>
          <ThemedText style={CommonText.sectionTitle}>Basic Information</ThemedText>

          <ThemedInput
            label={i18n.t('profile.edit.nameLabel')}
            value={displayName}
            onChangeText={(text) => {
              setDisplayName(text);
              if (displayNameError) {
                setDisplayNameError('');
              }
            }}
            onBlur={() => validateDisplayName(displayName)}
            errorMessage={displayNameError}
            maxLength={ValidationConstants.NAME_MAX_LENGTH}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => ageInputRef.current?.focus()}
            accessible={true}
            accessibilityLabel="Display name input"
            accessibilityHint="Enter your display name"
          />

          <ThemedInput
            label="Email Address"
            value={user?.email || ''}
            editable={false}
            selectTextOnFocus={false}
            style={styles.disabledInput}
            helperText="To change your email, use the Update Email option in Settings"
            accessible={true}
            accessibilityLabel="Email address (read-only)"
            accessibilityHint="Email address cannot be changed here"
          />

          <ThemedInput
            ref={ageInputRef}
            label="Age"
            value={age}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              setAge(numericText);
              if (ageError) {
                setAgeError('');
              }
            }}
            onBlur={() => validateAge(age)}
            errorMessage={ageError}
            keyboardType="number-pad"
            maxLength={3}
            placeholder="Enter your age"
            returnKeyType="next"
            onSubmitEditing={() => addressInputRef.current?.focus()}
            accessible={true}
            accessibilityLabel="Age input"
            accessibilityHint="Enter your age (optional)"
          />

          <ThemedText style={[CommonText.sectionTitle, styles.sectionTitleSpacing]}>Address (Optional)</ThemedText>

          <ThemedInput
            ref={addressInputRef}
            label="Street Address"
            value={address}
            onChangeText={setAddress}
            placeholder="123 Main St"
            maxLength={200}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => cityInputRef.current?.focus()}
            accessible={true}
            accessibilityLabel="Street address input"
            accessibilityHint="Enter your street address (optional)"
          />

          <ThemedInput
            ref={cityInputRef}
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="City"
            maxLength={100}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => stateInputRef.current?.focus()}
            accessible={true}
            accessibilityLabel="City input"
            accessibilityHint="Enter your city (optional)"
          />

          <ThemedView style={styles.inlineInputs}>
            <ThemedInput
              ref={stateInputRef}
              label="State"
              value={state}
              onChangeText={(text) => setState(text.toUpperCase())}
              placeholder="CA"
              maxLength={2}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => zipCodeInputRef.current?.focus()}
              containerStyle={styles.stateInput}
              accessible={true}
              accessibilityLabel="State code input"
              accessibilityHint="Enter your state code (optional)"
            />

            <ThemedInput
              ref={zipCodeInputRef}
              label="Zip Code"
              value={zipCode}
              onChangeText={(text) => {
                setZipCode(text);
                if (zipCodeError) {
                  setZipCodeError('');
                }
              }}
              onBlur={() => validateZipCode(zipCode)}
              errorMessage={zipCodeError}
              placeholder="12345"
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              maxLength={10}
              returnKeyType="done"
              onSubmitEditing={handleUpdate}
              containerStyle={styles.zipCodeInput}
              accessible={true}
              accessibilityLabel="Zip code input"
              accessibilityHint="Enter your zip code (optional)"
            />
          </ThemedView>
        </ThemedView>

        {/* Helper text */}
        {hasChanges && (
          <ThemedView style={styles.helperSection}>
            <ThemedText style={[styles.helperText, { color: tintColor }]}>You have unsaved changes</ThemedText>
          </ThemedView>
        )}
      </ThemedScrollView>

      {/* Actions Section - Fixed at bottom */}
      <ThemedView style={styles.actionsSection}>
        <ThemedButton
          title={loading ? i18n.t('profile.edit.savingButton') : i18n.t('profile.edit.saveButton')}
          onPress={handleUpdate}
          disabled={loading || imageLoading || !hasChanges}
          loading={loading}
          variant="primary"
          accessibilityLabel={loading ? 'Saving profile changes' : 'Save profile changes'}
          accessibilityHint={loading ? 'Please wait while changes are being saved' : hasChanges ? 'Tap to save your profile changes' : 'No changes to save'}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderRadius: 80,
    borderWidth: 2,
    padding: Spacing.xs,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 64,
    gap: Spacing.sm,
  },
  uploadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitleSpacing: {
    marginTop: Spacing.lg,
  },
  disabledInput: {
    opacity: 0.6,
  },
  inlineInputs: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  stateInput: {
    flex: 1,
  },
  zipCodeInput: {
    flex: 1.5,
  },
  helperSection: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  helperText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
  },
});
