import { updateUser } from '@/actions/user.action';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { auth } from '@/firebase-config';
import { useColorScheme } from '@/hooks/use-color-scheme';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const user = auth.currentUser;
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [displayNameError, setDisplayNameError] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!user) {
      return;
    }

    // Validate input
    if (!displayName.trim()) {
      setDisplayNameError(i18n.t('errors.validation.emptyDisplayName'));
      return;
    }

    setLoading(true);
    setDisplayNameError('');

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName, photoURL });

      // Update Firestore
      await updateUser(user.uid, {
        displayName,
        photoURL,
      });

      showSuccess(i18n.t('success.profileUpdate.title'), i18n.t('success.profileUpdate.message'), () => router.back());
    } catch (error) {
      console.error('Error updating profile: ', error);
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showError(new Error(i18n.t('errors.profile.permission.message')));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLoading(true);
      try {
        const response = await fetch(result.assets[0].uri);
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
        setLoading(false);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
        <Image source={{ uri: photoURL || 'https://www.gravatar.com/avatar/?d=mp' }} style={styles.avatar} />
        <ThemedText style={{ color: Colors[colorScheme ?? 'light'].tint }}>{i18n.t('profile.edit.changePhoto')}</ThemedText>
      </TouchableOpacity>

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
        containerStyle={styles.inputContainer}
      />

      <Button title={loading ? i18n.t('profile.edit.savingButton') : i18n.t('profile.edit.saveButton')} onPress={handleUpdate} disabled={loading} />
      {loading && <ActivityIndicator style={styles.loading} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 16,
    backgroundColor: '#ccc',
  },
  inputContainer: {
    marginBottom: 16,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
});
