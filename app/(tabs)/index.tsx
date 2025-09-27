
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/hooks/use-auth-provider';

export default function IndexScreen() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Welcome, {user?.displayName || 'User'}!</ThemedText>
      <ThemedText type="body" style={styles.email}>{user?.email}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    marginVertical: 16,
  },
});
