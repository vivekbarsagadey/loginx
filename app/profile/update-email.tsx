import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function UpdateEmailScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Update Email</ThemedText>
      <ThemedText>Update your email address here.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
