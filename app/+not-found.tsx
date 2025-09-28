
import { Link, Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <ThemedText type="h2">This screen doesn&apos;t exist.</ThemedText>
        <Link href="/" style={{ marginTop: 15, paddingVertical: 15 }}>
          <ThemedText style={{ fontSize: 14, color: '#2e78b7' }}>Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
