
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">MyApp</ThemedText>
      <ThemedText type="subtitle">Your awesome app tagline</ThemedText>
      <Link href="/(auth)/login" style={styles.link}>Login</Link>
      <Link href="/(auth)/register" style={styles.link}>Create Account</Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    textAlign: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
