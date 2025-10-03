import { updateUser } from '@/actions/user.action';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AccessibilityHints, AccessibilityRoles } from '@/constants/accessibility';
import { auth } from '@/firebase-config';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { sanitizeUserInput } from '@/utils/sanitize';
import { showSuccess } from '@/utils/success';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function EditProfileScreen() {
  const user = auth.currentUser;
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [displayNameError, setDisplayNameError] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? '');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Theme colors
  const tintColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');

  const handleUpdate = useCallback(async () => {
    if (!user) {
      return;
    }

    // Sanitize and validate input
    const sanitizedDisplayName = sanitizeUserInput(displayName.trim());
    if (!sanitizedDisplayName) {
      setDisplayNameError(i18n.t('errors.validation.emptyDisplayName'));
      return;
    }

    if (sanitizedDisplayName.length > 50) {
      setDisplayNameError('Display name must be less than 50 characters');
      return;
    }

    setLoading(true);
    setDisplayNameError('');

    try {
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: sanitizedDisplayName,
        photoURL,
      });

      // Update Firestore
      await updateUser(user.uid, {
        displayName: sanitizedDisplayName,
        photoURL,
      });

      showSuccess(i18n.t('success.profileUpdate.title'), i18n.t('success.profileUpdate.message'), () => router.back());
    } catch (error) {
      console.error('Error updating profile: ', error);
      showError(error);
    } finally {
      setLoading(false);
    }
  }, [user, displayName, photoURL, router]);

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
        quality: 0.7, // Better quality
        base64: false, // Don't need base64
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageLoading(true);
        try {
          const asset = result.assets[0];

          // Validate file size (max 5MB)
          if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
            showError(new Error('Image must be smaller than 5MB'));
            return;
          }

          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const storage = getStorage();
          const storageRef = ref(storage, `avatars/${user?.uid}`);

          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          setPhotoURL(downloadURL);
        } catch (error) {
          console.error('Error uploading image: ', error);
          showError(error);
        } finally {
          setImageLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image: ', error);
      showError(error);
      setImageLoading(false);
    }
  }, [user?.uid]);

  const defaultAvatarUri = 'https://www.gravatar.com/avatar/?d=mp&s=256';

  return (
    <ThemedView style={styles.container}>
      {/* Avatar Section */}
      <ThemedView style={styles.avatarSection}>
        <TouchableOpacity
          onPress={handleImagePick}
          style={[styles.avatarContainer, { borderColor }]}
          disabled={imageLoading}
          accessible={true}
          accessibilityRole={AccessibilityRoles.BUTTON}
          accessibilityLabel="Change profile photo"
          accessibilityHint={AccessibilityHints.BUTTON_TAP}
        >
          <Image source={{ uri: photoURL || defaultAvatarUri }} style={[styles.avatar, { borderColor }]} accessibilityIgnoresInvertColors={true} />
          {imageLoading && (
            <ThemedView style={styles.imageLoadingOverlay}>
              <ActivityIndicator size="large" color={tintColor} />
            </ThemedView>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleImagePick} disabled={imageLoading} accessible={true} accessibilityRole={AccessibilityRoles.BUTTON} accessibilityLabel="Change profile photo">
          <ThemedText style={[styles.changePhotoText, { color: tintColor }]}>{imageLoading ? 'Uploading...' : i18n.t('profile.edit.changePhoto')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Form Section */}
      <ThemedView style={styles.formSection}>
        <ThemedInput
          label={i18n.t('profile.edit.nameLabel')}
          value={displayName}
          onChangeText={(text) => {
            setDisplayName(text);
            if (displayNameError) {
              setDisplayNameError('');
            }
          }}
          errorMessage={displayNameError}
          maxLength={50}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleUpdate}
          accessible={true}
          accessibilityLabel="Display name input"
          accessibilityHint="Enter your display name"
        />
      </ThemedView>

      {/* Actions Section */}
      <ThemedView style={styles.actionsSection}>
        <ThemedButton
          title={loading ? i18n.t('profile.edit.savingButton') : i18n.t('profile.edit.saveButton')}
          onPress={handleUpdate}
          disabled={loading || imageLoading}
          loading={loading}
          variant="primary"
          accessibilityLabel={loading ? 'Saving profile changes' : 'Save profile changes'}
          accessibilityHint={loading ? 'Please wait while changes are being saved' : 'Tap to save your profile changes'}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 80,
    borderWidth: 2,
    padding: 4,
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 64,
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 32,
  },
  actionsSection: {
    marginTop: 'auto',
    paddingBottom: 16,
  },
});
