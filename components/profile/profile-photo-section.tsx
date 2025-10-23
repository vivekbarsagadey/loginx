import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AccessibilityHints, AccessibilityRoles } from '@/constants/accessibility';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { createLogger } from '@/utils/debug';
import { showError } from '@/utils/error';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';

const logger = createLogger('ProfilePhotoSection');

interface ProfilePhotoSectionProps {
  photoURL: string;
  userId: string;
  onPhotoChange: (url: string) => void;
  disabled?: boolean;
}

export function ProfilePhotoSection({ photoURL, userId, onPhotoChange, disabled = false }: ProfilePhotoSectionProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const tintColor = useThemeColor({}, 'primary');
  const overlayColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const defaultAvatarUri = 'https://www.gravatar.com/avatar/?d=mp&s=256';

  const handleImagePick = async () => {
    try {
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
          const storageRef = ref(storage, `avatars/${userId}_${Date.now()}`);

          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          onPhotoChange(downloadURL);

          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (_error) {
          logger.error('Error uploading image:', error);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          showError(error);
        } finally {
          setImageLoading(false);
        }
      }
    } catch (_error) {
      logger.error('Error picking image:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
      setImageLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        onPress={handleImagePick}
        style={[styles.avatarContainer, { borderColor }]}
        disabled={imageLoading || disabled}
        accessible={true}
        accessibilityRole={AccessibilityRoles.BUTTON}
        accessibilityLabel="Change profile photo"
        accessibilityHint={AccessibilityHints.BUTTON_TAP}
      >
        <Image source={{ uri: photoURL || defaultAvatarUri }} style={[styles.avatar, { borderColor }]} accessibilityIgnoresInvertColors={true} />
        {imageLoading && (
          <ThemedView style={[styles.imageLoadingOverlay, { backgroundColor: `${overlayColor}80` }]}>
            <ActivityIndicator size="large" color={tintColor} />
            <ThemedText style={[styles.uploadingText, { color: tintColor }]}>Uploading...</ThemedText>
          </ThemedView>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleImagePick} disabled={imageLoading || disabled} accessible={true} accessibilityRole={AccessibilityRoles.BUTTON} accessibilityLabel="Change profile photo">
        <ThemedText style={[styles.changePhotoText, { color: tintColor }]}>{imageLoading ? 'Uploading...' : i18n.t('profile.edit.changePhoto')}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  uploadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changePhotoText: {
    marginTop: Spacing.md,
    fontSize: 16,
    fontWeight: '600',
  },
});
