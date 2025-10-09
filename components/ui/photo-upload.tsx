import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAlert } from '@/hooks/use-alert';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, View } from 'react-native';

interface PhotoUploadProps {
  value?: string;
  onChange: (uri: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Photo Upload Component
 * Allows users to pick and crop profile photos
 */
export function PhotoUpload({ value, onChange, onError }: PhotoUploadProps) {
  const [loading, setLoading] = useState(false);
  const { show: showAlert, AlertComponent } = useAlert();
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const bgColor = useThemeColor({}, 'surface-variant');
  const textColor = useThemeColor({}, 'text');
  const onPrimaryColor = useThemeColor({}, 'on-primary');

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        showAlert('Permissions Required', 'Please grant camera and photo library permissions to upload a profile photo.', [{ text: 'OK' }], { variant: 'warning' });
        return false;
      }
    }
    return true;
  };

  const pickImage = async (source: 'camera' | 'library') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }

    setLoading(true);

    try {
      let result: ImagePicker.ImagePickerResult;

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        // Validate file size (max 5MB)
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          showAlert('Image Too Large', 'Image must be smaller than 5MB. Please select a smaller image.', [{ text: 'OK' }], { variant: 'warning' });
          onError?.(new Error('Image file size exceeds 5MB limit'));
          return;
        }

        const uri = asset.uri;
        onChange(uri);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('[PhotoUpload] Error picking image:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      onError?.(error instanceof Error ? error : new Error('Failed to pick image'));
      showAlert('Error', 'Failed to pick image. Please try again.', [{ text: 'OK' }], { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const showImagePicker = () => {
    showAlert('Profile Photo', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => pickImage('camera'),
      },
      {
        text: 'Choose from Library',
        onPress: () => pickImage('library'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const removePhoto = () => {
    showAlert('Remove Photo', 'Are you sure you want to remove your profile photo?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          onChange('');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="caption" style={styles.label}>
        Profile Photo (Optional)
      </ThemedText>

      <View style={styles.uploadContainer}>
        <Pressable
          style={[styles.photoContainer, { borderColor, backgroundColor: bgColor }]}
          onPress={showImagePicker}
          disabled={loading}
          accessibilityLabel="Upload profile photo"
          accessibilityHint="Tap to choose a photo from your camera or library"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator size="large" color={primaryColor} />
          ) : value ? (
            <Image source={{ uri: value }} style={styles.photo} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="person" size={48} color={borderColor} />
              <ThemedText type="caption" style={styles.placeholderText}>
                Tap to add photo
              </ThemedText>
            </View>
          )}
        </Pressable>

        {value && !loading && (
          <Pressable style={[styles.removeButton, { backgroundColor: primaryColor }]} onPress={removePhoto} accessibilityLabel="Remove profile photo" accessibilityRole="button">
            <Ionicons name="close" size={20} color={onPrimaryColor} />
          </Pressable>
        )}
      </View>

      <ThemedText type="caption" style={[styles.helperText, { color: textColor }]}>
        {value ? 'Tap to change photo or press X to remove' : 'Add a profile photo to personalize your account'}
      </ThemedText>
      {AlertComponent}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginVertical: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    opacity: 0.6,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: '50%',
    marginRight: -70,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow color handled by platform defaults
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  helperText: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 8,
  },
});
