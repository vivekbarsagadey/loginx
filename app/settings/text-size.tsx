
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function TextSizeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Text Size Screen</ThemedText>
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
