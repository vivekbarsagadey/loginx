
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function TermsScreen() {
  return (
    <ThemedView style={{ flex: 1, padding: 24 }}>
      <ThemedText type="h1">Terms of Service</ThemedText>
    </ThemedView>
  );
}
