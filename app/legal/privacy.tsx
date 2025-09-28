
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function PrivacyScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Privacy Policy Screen</ThemedText>
      <ThemedText>Coming Soon!</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
