
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function WhatsNewScreen() {
  return (
    <ThemedView style={{ flex: 1, padding: 24 }}>
      <ThemedText type="h1">What's New</ThemedText>
    </ThemedView>
  );
}
