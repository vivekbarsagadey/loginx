import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <ThemedText type="h2">This screen doesn&apos;t exist.</ThemedText>
        <Link href="/" style={{ marginTop: 15, paddingVertical: 15 }}>
          <ThemedText style={{ fontSize: 14, color: primaryColor }}>Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
