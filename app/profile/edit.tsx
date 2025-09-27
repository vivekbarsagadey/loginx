
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
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

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const user = auth.currentUser;
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (user) {
        await updateProfile(user, { displayName, photoURL });
        router.back();
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${user?.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
        <Image source={{ uri: photoURL }} style={styles.avatar} />
        <ThemedText style={{ color: Colors[colorScheme ?? 'light'].tint }}>Change Photo</ThemedText>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <ThemedText>Name</ThemedText>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          style={[styles.input, { color: Colors[colorScheme ?? 'light'].text, borderColor: Colors[colorScheme ?? 'light'].gray }]}
        />
      </View>
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
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  loading: {
    marginTop: 16,
  }
});
