
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/hooks/use-auth-provider';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Profile</ThemedText>
      <ThemedText type="body" style={styles.userInfo}>Welcome, {user?.displayName || 'User'}!</ThemedText>
      <ThemedText type="body" style={styles.userInfo}>{user?.email}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    marginVertical: 8,
  },
});
