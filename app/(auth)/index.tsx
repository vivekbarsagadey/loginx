
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/themed-button';
import { useAuth } from '@/hooks/use-auth-provider';

export default function AuthScreen() {
  const { setUser } = useAuth();
  return (
    <ThemedView>
      <ThemedText>Auth Screen</ThemedText>
      <ThemedButton title="Login" onPress={() => setUser({name: 'Test User'})} />
    </ThemedView>
  )
}
