import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAlert } from '@/hooks/use-alert';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createLogger } from '@/utils/debug';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { memo, useCallback, useState } from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet, View } from 'react-native';

const logger = createLogger('MultiPhotoPicker');

interface MultiPhotoPickerProps {
  value?: string[];
  onChange: (uris: string[]) => void;
  onError?: (_error: Error) => void;
  maxPhotos?: number;
  maxFileSize?: number; // in bytes
}

interface PhotoItemProps {
  item: string;
  index: number;
  onRemove: (index: number) => void;
  borderColor: string;
  primaryColor: string;
  errorColor: string;
  shadowColor: string;
}

const PhotoItem = memo(({ item, index, onRemove, borderColor, primaryColor, errorColor, shadowColor }: PhotoItemProps) => (
  <View style={styles.photoItem}>
    <Image source={{ uri: item }} style={[styles.photo, { borderColor }]} accessibilityIgnoresInvertColors />
    <Pressable style={[styles.removeButton, { backgroundColor: errorColor, shadowColor }]} onPress={() => onRemove(index)} accessibilityLabel={`Remove photo ${index + 1}`} accessibilityRole="button">
      <Ionicons name="close" size={16} color="white" />
    </Pressable>
    <View style={[styles.photoNumber, { backgroundColor: primaryColor, shadowColor }]}>
      <ThemedText style={styles.photoNumberText}>{index + 1}</ThemedText>
    </View>
  </View>
));

PhotoItem.displayName = 'PhotoItem';

/**
 * Multi Photo Picker Component
 * Allows users to select multiple photos from gallery
 */
export function MultiPhotoPicker({ value = [], onChange, onError, maxPhotos = 10, maxFileSize = 5 * 1024 * 1024 }: MultiPhotoPickerProps) {
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const bgColor = useThemeColor({}, 'surface-variant');
  const textColor = useThemeColor({}, 'text');
  const errorColor = useThemeColor({}, 'error');
  const shadowColor = useThemeColor({}, 'shadow');

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        alert.show('Permission Required', 'Please grant photo library permission to select photos.', [{ text: 'OK' }]);
        return false;
      }
    }
    return true;
  };

  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }

    if (value.length >= maxPhotos) {
      alert.show('Maximum Photos Reached', `You can only select up to ${maxPhotos} photos.`, [{ text: 'OK' }], { variant: 'warning' });
      return;
    }

    setLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        allowsEditing: false,
        quality: 0.8,
        selectionLimit: maxPhotos - value.length,
      });

      if (!result.canceled && result.assets) {
        // Validate file sizes
        const validAssets: string[] = [];
        const invalidAssets: string[] = [];

        for (const asset of result.assets) {
          if (asset.fileSize && asset.fileSize > maxFileSize) {
            invalidAssets.push(asset.uri);
          } else {
            validAssets.push(asset.uri);
          }
        }

        if (invalidAssets.length > 0) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          alert.show('Some Images Too Large', `${invalidAssets.length} image(s) exceeded the ${Math.round(maxFileSize / (1024 * 1024))}MB limit and were skipped.`, [{ text: 'OK' }], {
            variant: 'warning',
          });
        }

        if (validAssets.length > 0) {
          const newPhotos = [...value, ...validAssets].slice(0, maxPhotos);
          onChange(newPhotos);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (_error: unknown) {
      logger.error('Error picking images:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      onError?.(_error instanceof Error ? error : new Error('Failed to pick images'));
      alert.show('Error', 'Failed to pick images. Please try again.', [{ text: 'OK' }], { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = useCallback(
    (index: number) => {
      alert.show('Remove Photo', 'Are you sure you want to remove this photo?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPhotos = [...value];
            newPhotos.splice(index, 1);
            onChange(newPhotos);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
      ]);
    },
    [alert, onChange, value]
  );

  const clearAll = useCallback(() => {
    alert.show('Remove All Photos', 'Are you sure you want to remove all photos?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove All',
        style: 'destructive',
        onPress: () => {
          onChange([]);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      },
    ]);
  }, [alert, onChange]);

  const renderPhoto = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <PhotoItem item={item} index={index} onRemove={removePhoto} borderColor={borderColor} primaryColor={primaryColor} errorColor={errorColor} shadowColor={shadowColor} />
    ),
    [removePhoto, borderColor, primaryColor, errorColor, shadowColor]
  );

  const getItemLayout = useCallback((_data: ArrayLike<string> | null | undefined, index: number) => {
    const itemSize = 120;
    return {
      length: itemSize,
      offset: itemSize * index,
      index,
    };
  }, []);

  const renderEmpty = () => (
    <View style={[styles.emptyContainer, { borderColor, backgroundColor: bgColor }]}>
      <Ionicons name="images" size={48} color={borderColor} />
      <ThemedText type="caption" style={styles.emptyText}>
        No photos selected
      </ThemedText>
      <ThemedText type="caption" style={[styles.helperText, { color: textColor }]}>
        Tap &quot;Add Photos&quot; to select up to {maxPhotos} photos
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="caption" style={styles.label}>
          Photos ({value.length}/{maxPhotos})
        </ThemedText>
        {value.length > 0 && (
          <Pressable onPress={clearAll} accessibilityLabel="Remove all photos" accessibilityRole="button">
            <ThemedText style={[styles.clearText, { color: errorColor }]}>Clear All</ThemedText>
          </Pressable>
        )}
      </View>

      {value.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={value}
          renderItem={renderPhoto}
          keyExtractor={(item, index) => `${item}-${index}`}
          numColumns={3}
          contentContainerStyle={styles.grid}
          scrollEnabled={false}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={9}
          windowSize={3}
          initialNumToRender={9}
        />
      )}

      <ThemedButton
        title={loading ? 'Loading...' : value.length === 0 ? 'Add Photos' : 'Add More Photos'}
        onPress={pickImages}
        disabled={loading || value.length >= maxPhotos}
        loading={loading}
        variant={value.length === 0 ? 'primary' : 'secondary'}
        style={styles.button}
        accessibilityLabel={value.length === 0 ? 'Add photos' : 'Add more photos'}
        accessibilityHint={`You can add up to ${maxPhotos - value.length} more photo${maxPhotos - value.length !== 1 ? 's' : ''}`}
      />

      <ThemedText type="caption" style={[styles.helperText, { color: textColor }]}>
        Maximum file size: {Math.round(maxFileSize / (1024 * 1024))}MB per photo
      </ThemedText>
      {alert.AlertComponent}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
  },
  grid: {
    gap: 8,
  },
  photoItem: {
    flex: 1,
    maxWidth: '33.33%',
    aspectRatio: 1,
    padding: 4,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoNumber: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoNumberText: {
    fontSize: 12,
    fontWeight: '700',
    // color: Use colors['on-primary'] inline where this style is used
  },
  emptyContainer: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    marginTop: 8,
    opacity: 0.7,
  },
  button: {
    marginTop: 8,
  },
  helperText: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 12,
  },
});
