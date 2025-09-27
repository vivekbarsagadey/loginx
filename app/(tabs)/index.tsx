
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { useAuth } from '@/hooks/use-auth-provider';

export default function IndexScreen() {
  const { user, signOut } = useAuth();

  return (
    <ThemedView>
      <ThemedText>Welcome, {user?.email}</ThemedText>
      <ThemedButton title="Logout" onPress={signOut} />
    </ThemedView>
  );
}
