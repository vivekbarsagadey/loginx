
import { View, Button, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { auth } from '@/firebase-config';
import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateUserProfile } from '@/actions/user.action';
import { ThemedInput } from '@/components/themed-input';

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const user = auth.currentUser;
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [displayNameError, setDisplayNameError] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!user) return;

    // Validate input
    if (!displayName.trim()) {
      setDisplayNameError('Display name cannot be empty.');
      return;
    }

    setLoading(true);
    setDisplayNameError('');

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName, photoURL });

      // Update Firestore
      await updateUserProfile(user.uid, {
        displayName,
        photoURL,
      });

      Alert.alert('Success', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating profile: ", error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
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
        console.error("Error uploading image: ", error);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
        <Image source={{ uri: photoURL || 'https://www.gravatar.com/avatar/?d=mp' }} style={styles.avatar} />
        <ThemedText style={{ color: Colors[colorScheme ?? 'light'].tint }}>Change Photo</ThemedText>
      </TouchableOpacity>

      <ThemedInput
        label="Name"
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

      <Button title={loading ? 'Saving...' : 'Save'} onPress={handleUpdate} disabled={loading} />
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
  }
});
