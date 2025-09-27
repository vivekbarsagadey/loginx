
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { useAuth } from '@/hooks/use-auth-provider';

export default function IndexScreen() {
  const { user, signOut } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Welcome, {user?.displayName || 'User'}!</ThemedText>
      <ThemedText type="body" style={styles.email}>{user?.email}</ThemedText>
      <ThemedButton title="Logout" onPress={signOut} style={styles.button} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  email: {
    marginVertical: 16,
  },
  button: {
    marginTop: 32,
  },
});
